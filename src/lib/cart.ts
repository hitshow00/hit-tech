import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma, type Cart, type CartItem, type Product, ProductStatus } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";

export const CART_COOKIE_NAME = "ht_cart";
const CART_DURATION_DAYS = 30;

export interface CartSummaryItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  imageUrl: string | null;
  imageAlt: string | null;
  unitPrice: number; // centimes
  compareAtPrice: number | null;
  quantity: number;
  stock: number;
  lineTotal: number;
  available: boolean;
}

export interface CartSummary {
  id: string;
  items: CartSummaryItem[];
  itemCount: number;
  subtotal: number; // centimes
  discountCode: string | null;
  discountTotal: number;
  shippingFee: number;
  freeShippingThreshold: number | null;
  qualifiesForFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  grandTotal: number;
}

export async function getOrCreateCartId(userId?: string | null): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashToken(token);
    const existing = await prisma.cart.findUnique({
      where: { tokenHash },
    });
    if (existing) {
      if (userId && existing.userId !== userId) {
        await prisma.cart.update({
          where: { id: existing.id },
          data: { userId },
        });
      }
      return existing.id;
    }
  }

  // Si l'utilisateur est connecté, vérifier s'il a déjà un panier actif
  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    if (userCart) {
      return userCart.id;
    }
  }

  const newToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(newToken);
  const newCart = await prisma.cart.create({
    data: {
      tokenHash,
      userId: userId ?? null,
    },
  });

  const expiresAt = new Date(Date.now() + CART_DURATION_DAYS * 24 * 60 * 60 * 1000);
  cookieStore.set(CART_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return newCart.id;
}

export async function getCartSummary(userId?: string | null): Promise<CartSummary | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE_NAME)?.value;

  let cart = null;
  if (token) {
    const tokenHash = hashToken(token);
    cart = await prisma.cart.findUnique({
      where: { tokenHash },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  } else if (userId) {
    cart = await prisma.cart.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  if (!cart) {
    return null;
  }

  const settings = await prisma.storeSettings.findFirst();
  const freeThreshold = settings?.freeShippingThreshold ?? null;

  const items: CartSummaryItem[] = cart.items.map((ci) => {
    const p = ci.product;
    const isAvailable = p.status === ProductStatus.PUBLISHED && p.stock > 0;
    const lineTotal = p.price * ci.quantity;
    return {
      id: ci.id,
      productId: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      imageUrl: p.images[0]?.thumbUrl ?? p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt ?? p.name,
      unitPrice: p.price,
      compareAtPrice: p.compareAtPrice,
      quantity: ci.quantity,
      stock: p.stock,
      lineTotal,
      available: isAvailable,
    };
  });

  const subtotal = items
    .filter((i) => i.available)
    .reduce((acc, curr) => acc + curr.lineTotal, 0);

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  // Remise si un code promo est présent
  let discountTotal = 0;
  if (cart.discountCode && subtotal > 0) {
    const discount = await prisma.discountCode.findUnique({
      where: { code: cart.discountCode.toUpperCase() },
    });
    if (
      discount &&
      discount.isActive &&
      (!discount.startsAt || discount.startsAt <= new Date()) &&
      (!discount.endsAt || discount.endsAt >= new Date()) &&
      (!discount.maxUses || discount.usedCount < discount.maxUses) &&
      subtotal >= discount.minSubtotal
    ) {
      if (discount.type === "PERCENT") {
        discountTotal = Math.round((subtotal * discount.value) / 100);
      } else {
        discountTotal = Math.min(discount.value, subtotal);
      }
    }
  }

  const netSubtotal = Math.max(0, subtotal - discountTotal);

  // Livraison par défaut (calculée avec seuil de gratuité)
  const defaultShippingFee = 3500; // 35 DH par défaut pour le Maroc
  const qualifiesForFreeShipping = freeThreshold !== null && netSubtotal >= freeThreshold;
  const shippingFee = qualifiesForFreeShipping || items.length === 0 ? 0 : defaultShippingFee;
  const amountNeededForFreeShipping =
    freeThreshold !== null && netSubtotal < freeThreshold
      ? freeThreshold - netSubtotal
      : 0;

  return {
    id: cart.id,
    items,
    itemCount,
    subtotal,
    discountCode: cart.discountCode,
    discountTotal,
    shippingFee,
    freeShippingThreshold: freeThreshold,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping,
    grandTotal: netSubtotal + shippingFee,
  };
}
