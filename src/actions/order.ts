"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma, OrderStatus, PaymentMethod, PaymentStatus, ProductStatus } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";
import { orderInputSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

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
    // 1. Validation stricte des entrées via Zod
    const parsed = orderInputSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données de commande invalides.";
      return { success: false, error: firstError };
    }
    const validatedData = parsed.data;

    // 2. Protection contre les abus et le spam (Rate Limiting)
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
    const rateCheck = checkRateLimit(`${ip}:${validatedData.email}`, {
      keyPrefix: "create_order",
      maxRequests: 10,
      windowMs: 15 * 60 * 1000, // 10 commandes max par 15 min par IP/email
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: `Trop de tentatives de commande. Veuillez patienter ${rateCheck.resetInSeconds} secondes avant de réessayer.`,
      };
    }

    const { user } = await getCurrentUser();
    const cartSummary = await getCartSummary(user?.id);

    if (!cartSummary || cartSummary.items.length === 0) {
      return { success: false, error: "Votre panier est vide." };
    }

    // 3. Récupérer et vérifier la ville de livraison sélectionnée
    const shippingCity = await prisma.shippingCity.findUnique({
      where: { id: validatedData.cityId },
    });

    if (!shippingCity || !shippingCity.isActive) {
      return { success: false, error: "Ville de livraison invalide ou indisponible." };
    }

    const settings = await prisma.storeSettings.findFirst();

    // 4. Vérification et recalcul rigoureux des prix & stocks côté serveur
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

    // 5. Calcul de la remise si code promo actif et valide
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

    // 6. Frais de livraison réels selon la ville et le seuil de gratuité
    const freeThreshold = settings?.freeShippingThreshold ?? null;
    const qualifiesForFreeShipping = freeThreshold !== null && netSubtotal >= freeThreshold;
    const shippingFee = qualifiesForFreeShipping ? 0 : shippingCity.fee;
    const total = netSubtotal + shippingFee;

    // 7. Mode de paiement : Paiement à la livraison (COD) sécurisé
    if (validatedData.paymentMethod === "STRIPE") {
      return {
        success: false,
        error: "Le paiement par carte bancaire en ligne est actuellement désactivé. Veuillez sélectionner le paiement sécurisé à la livraison.",
      };
    }

    // Vérification COD
    if (!settings?.codEnabled || !shippingCity.codAvailable) {
      return { success: false, error: "Le paiement à la livraison n'est pas disponible pour cette destination." };
    }
    if (settings.codMaxAmount && total > settings.codMaxAmount) {
      const maxDH = Math.round(settings.codMaxAmount / 100);
      return {
        success: false,
        error: `Le montant total (${Math.round(total / 100)} DH) dépasse la limite autorisée pour le paiement à la livraison (${maxDH} DH).`,
      };
    }

    // 8. Génération d'un numéro de commande robuste et anti-collision (ex. HT-2026-X8Y2A1)
    const year = new Date().getFullYear();
    const timeComponent = Date.now().toString(36).toUpperCase().slice(-4);
    const randomComponent = crypto.randomBytes(2).toString("hex").toUpperCase();
    const orderNumber = `HT-${year}-${timeComponent}${randomComponent}`;

    // Jeton d'accès cryptographique pour consultation de la commande sans compte
    const rawAccessToken = crypto.randomBytes(32).toString("base64url");
    const accessTokenHash = crypto.createHash("sha256").update(rawAccessToken).digest("hex");

    const deliveryEstimate =
      shippingCity.minDays === shippingCity.maxDays
        ? `${shippingCity.minDays} jour${shippingCity.minDays > 1 ? "s" : ""}`
        : `${shippingCity.minDays} à ${shippingCity.maxDays} jours`;

    // 9. Transaction atomique avec protection stricte contre le sur-stock (Atomic Decrement)
    const order = await prisma.$transaction(async (tx) => {
      // Étape A : Décrémentation atomique conditionnelle (empêche les stocks négatifs en cas d'accès simultané)
      for (const item of verifiedItems) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity }, // Condition atomique row-level
          },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(`STOCK_INSUFFICIENT:${item.name}`);
        }
      }

      // Étape B : Incrémenter le compteur d'utilisation du code promo
      if (validDiscountCode) {
        await tx.discountCode.update({
          where: { code: validDiscountCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Étape C : Création de la commande
      const createdOrder = await tx.order.create({
        data: {
          number: orderNumber,
          accessTokenHash,
          userId: user?.id ?? null,
          email: validatedData.email.toLowerCase(),
          status: OrderStatus.CONFIRMED,
          paymentMethod: PaymentMethod.COD,
          paymentStatus: PaymentStatus.UNPAID,
          subtotal: liveSubtotal,
          discountTotal,
          discountCode: validDiscountCode,
          shippingFee,
          total,
          shipFullName: validatedData.fullName,
          shipPhone: validatedData.phone,
          shipLine1: validatedData.addressLine1,
          shipLine2: validatedData.addressLine2 || null,
          shipCity: shippingCity.name,
          shipPostalCode: validatedData.postalCode || null,
          shippingCityId: shippingCity.id,
          deliveryEstimate,
          customerNote: validatedData.customerNote || null,
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
              note: "Commande confirmée avec option paiement en espèces à la livraison (Casablanca & Maroc).",
            },
          },
        },
      });

      // Étape D : Vider les éléments du panier
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
    if (error?.message?.startsWith("STOCK_INSUFFICIENT:")) {
      const productName = error.message.replace("STOCK_INSUFFICIENT:", "");
      return {
        success: false,
        error: `Le stock pour « ${productName} » a été réservé par une autre commande. Veuillez ajuster votre panier.`,
      };
    }
    console.error("Erreur création commande :", error);
    return { success: false, error: "Impossible de valider votre commande. Veuillez réessayer." };
  }
}
