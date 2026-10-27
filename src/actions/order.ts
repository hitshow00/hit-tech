"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma, OrderStatus, PaymentMethod, PaymentStatus, ProductStatus } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";

export interface CreateOrderInput {
  fullName: string;
  email: string;
  phone: string;
  cityId: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  customerNote?: string;
  paymentMethod: "COD" | "STRIPE";
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    const { user } = await getCurrentUser();
    const cartSummary = await getCartSummary(user?.id);

    if (!cartSummary || cartSummary.items.length === 0) {
      return { success: false, error: "Votre panier est vide." };
    }

    if (!input.fullName.trim() || !input.email.trim() || !input.phone.trim() || !input.addressLine1.trim() || !input.cityId) {
      return { success: false, error: "Veuillez renseigner toutes les informations de livraison obligatoires." };
    }

    // Récupérer la ville de livraison sélectionnée
    const shippingCity = await prisma.shippingCity.findUnique({
      where: { id: input.cityId },
    });

    if (!shippingCity || !shippingCity.isActive) {
      return { success: false, error: "Ville de livraison invalide ou indisponible." };
    }

    const settings = await prisma.storeSettings.findFirst();

    // Vérification des stocks et calcul rigoureux côté serveur
    let liveSubtotal = 0;
    const verifiedItems: Array<{
      productId: string;
      name: string;
      slug: string;
      sku: string;
      imageUrl: string | null;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (const item of cartSummary.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.status !== ProductStatus.PUBLISHED) {
        return { success: false, error: `Le produit « ${item.name} » n'est plus disponible.` };
      }

      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuffisant pour « ${product.name} » (${product.stock} restant${product.stock > 1 ? "s" : ""}). Veuillez ajuster votre panier.`,
        };
      }

      const lineTotal = product.price * item.quantity;
      liveSubtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        imageUrl: item.imageUrl,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // Calcul de la remise si code promo
    let discountTotal = 0;
    let validDiscountCode: string | null = null;
    if (cartSummary.discountCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: cartSummary.discountCode.toUpperCase() },
      });
      if (
        discount &&
        discount.isActive &&
        (!discount.startsAt || discount.startsAt <= new Date()) &&
        (!discount.endsAt || discount.endsAt >= new Date()) &&
        (!discount.maxUses || discount.usedCount < discount.maxUses) &&
        liveSubtotal >= discount.minSubtotal
      ) {
        validDiscountCode = discount.code;
        if (discount.type === "PERCENT") {
          discountTotal = Math.round((liveSubtotal * discount.value) / 100);
        } else {
          discountTotal = Math.min(discount.value, liveSubtotal);
        }
      }
    }

    const netSubtotal = Math.max(0, liveSubtotal - discountTotal);

    // Frais de livraison réels selon la ville et le seuil de gratuité
    const freeThreshold = settings?.freeShippingThreshold ?? null;
    const qualifiesForFreeShipping = freeThreshold !== null && netSubtotal >= freeThreshold;
    const shippingFee = qualifiesForFreeShipping ? 0 : shippingCity.fee;
    const total = netSubtotal + shippingFee;

    // Vérification du mode de paiement
    if (input.paymentMethod === "COD") {
      if (!settings?.codEnabled || !shippingCity.codAvailable) {
        return { success: false, error: "Le paiement à la livraison n'est pas disponible pour cette destination." };
      }
      if (settings.codMaxAmount && total > settings.codMaxAmount) {
        const maxDH = Math.round(settings.codMaxAmount / 100);
        return {
          success: false,
          error: `Le montant total (${Math.round(total / 100)} DH) dépasse la limite autorisée pour le paiement à la livraison (${maxDH} DH). Veuillez choisir le paiement par carte.`,
        };
      }
    } else if (input.paymentMethod === "STRIPE") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return {
          success: false,
          error: "Le paiement par carte bancaire en ligne nécessite la configuration des clés Stripe. Veuillez sélectionner le paiement à la livraison.",
        };
      }
    }

    // Génération du numéro de commande unique (ex. HT-2026-XXXX)
    const year = new Date().getFullYear();
    const count = await prisma.order.count();
    const orderNumber = `HT-${year}-${String(count + 1).padStart(4, "0")}`;

    // Jeton d'accès pour suivi invité sans compte
    const rawAccessToken = crypto.randomBytes(32).toString("base64url");
    const accessTokenHash = crypto.createHash("sha256").update(rawAccessToken).digest("hex");

    const deliveryEstimate =
      shippingCity.minDays === shippingCity.maxDays
        ? `${shippingCity.minDays} jour${shippingCity.minDays > 1 ? "s" : ""}`
        : `${shippingCity.minDays} à ${shippingCity.maxDays} jours`;

    // Transaction atomique : création de commande, décrément de stock, incrément du code promo, vidage du panier
    const order = await prisma.$transaction(async (tx) => {
      // 1. Décrémentation des stocks
      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // 2. Incrémenter le compteur du code promo s'il a été utilisé
      if (validDiscountCode) {
        await tx.discountCode.update({
          where: { code: validDiscountCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 3. Création de la commande
      const createdOrder = await tx.order.create({
        data: {
          number: orderNumber,
          accessTokenHash,
          userId: user?.id ?? null,
          email: input.email.trim().toLowerCase(),
          status: OrderStatus.CONFIRMED,
          paymentMethod: input.paymentMethod === "COD" ? PaymentMethod.COD : PaymentMethod.STRIPE,
          paymentStatus: PaymentStatus.UNPAID,
          subtotal: liveSubtotal,
          discountTotal,
          discountCode: validDiscountCode,
          shippingFee,
          total,
          shipFullName: input.fullName.trim(),
          shipPhone: input.phone.trim(),
          shipLine1: input.addressLine1.trim(),
          shipLine2: input.addressLine2?.trim() || null,
          shipCity: shippingCity.name,
          shipPostalCode: input.postalCode?.trim() || null,
          shippingCityId: shippingCity.id,
          deliveryEstimate,
          customerNote: input.customerNote?.trim() || null,
          carrier: "Amana Express / Messagerie Rapide Maroc",
          items: {
            create: verifiedItems.map((vi) => ({
              productId: vi.productId,
              productName: vi.name,
              productSlug: vi.slug,
              sku: vi.sku,
              imageUrl: vi.imageUrl,
              unitPrice: vi.unitPrice,
              quantity: vi.quantity,
              lineTotal: vi.lineTotal,
            })),
          },
          history: {
            create: {
              status: OrderStatus.CONFIRMED,
              note:
                input.paymentMethod === "COD"
                  ? "Commande confirmée avec option paiement en espèces à la livraison."
                  : "Commande enregistrée (en attente de paiement Stripe).",
            },
          },
        },
      });

      // 4. Vider les éléments du panier
      await tx.cartItem.deleteMany({
        where: { cartId: cartSummary.id },
      });

      await tx.cart.update({
        where: { id: cartSummary.id },
        data: { discountCode: null },
      });

      return createdOrder;
    });

    revalidatePath("/panier");
    revalidatePath("/commande");
    revalidatePath("/admin/commandes");

    return {
      success: true,
      orderNumber: order.number,
      accessToken: rawAccessToken,
    };
  } catch (error: any) {
    console.error("Erreur création commande :", error);
    return { success: false, error: "Impossible de valider votre commande. Veuillez réessayer." };
  }
}
