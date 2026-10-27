"use server";

import { revalidatePath } from "next/cache";
import { prisma, ProductStatus } from "@/lib/prisma";
import { getOrCreateCartId, getCartSummary } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

export async function addToCartAction(productId: string, quantity = 1) {
  try {
    const { user } = await getCurrentUser();
    const cartId = await getOrCreateCartId(user?.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== ProductStatus.PUBLISHED) {
      return { success: false, error: "Produit non disponible" };
    }

    if (product.stock < quantity) {
      return { success: false, error: `Stock insuffisant (${product.stock} disponible${product.stock > 1 ? "s" : ""})` };
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    const newQty = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQty > product.stock) {
      return { success: false, error: `Quantité maximale disponible atteinte (${product.stock})` };
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity: newQty,
        },
      });
    }

    revalidatePath("/panier");
    revalidatePath("/commande");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur ajout panier :", error);
    return { success: false, error: "Impossible d'ajouter le produit au panier" };
  }
}

export async function updateCartItemQuantityAction(itemId: string, newQuantity: number) {
  try {
    if (newQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });

      if (!item) {
        return { success: false, error: "Élément introuvable" };
      }

      if (newQuantity > item.product.stock) {
        return {
          success: false,
          error: `Stock insuffisant (${item.product.stock} maximum)`,
        };
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity },
      });
    }

    revalidatePath("/panier");
    revalidatePath("/commande");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur de mise à jour du panier" };
  }
}

export async function removeCartItemAction(itemId: string) {
  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/panier");
    revalidatePath("/commande");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur de suppression" };
  }
}

export async function applyDiscountCodeAction(code: string) {
  try {
    const { user } = await getCurrentUser();
    const cartSummary = await getCartSummary(user?.id);

    if (!cartSummary) {
      return { success: false, error: "Votre panier est vide" };
    }

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      // Retirer le code
      await prisma.cart.update({
        where: { id: cartSummary.id },
        data: { discountCode: null },
      });
      revalidatePath("/panier");
      revalidatePath("/commande");
      return { success: true, message: "Code promo retiré" };
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: cleanCode },
    });

    if (!discount || !discount.isActive) {
      return { success: false, error: "Ce code promo n'existe pas ou n'est plus actif" };
    }

    if (discount.startsAt && discount.startsAt > new Date()) {
      return { success: false, error: "Ce code promo n'est pas encore disponible" };
    }

    if (discount.endsAt && discount.endsAt < new Date()) {
      return { success: false, error: "Ce code promo a expiré" };
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return { success: false, error: "Ce code promo a atteint sa limite d'utilisation" };
    }

    if (cartSummary.subtotal < discount.minSubtotal) {
      const minMAD = Math.round(discount.minSubtotal / 100);
      return {
        success: false,
        error: `Ce code nécessite un panier d'au moins ${minMAD} DH (actuellement ${Math.round(cartSummary.subtotal / 100)} DH)`,
      };
    }

    await prisma.cart.update({
      where: { id: cartSummary.id },
      data: { discountCode: cleanCode },
    });

    revalidatePath("/panier");
    revalidatePath("/commande");
    return { success: true, message: "Code promo appliqué avec succès !" };
  } catch (error) {
    return { success: false, error: "Erreur lors de l'application du code promo" };
  }
}
