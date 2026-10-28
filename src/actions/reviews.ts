"use server";

import { revalidatePath } from "next/cache";
import { prisma, ReviewStatus } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function submitReviewAction(formData: FormData) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vous devez être connecté pour publier un avis." };
    }

    const productId = String(formData.get("productId") || "").trim();
    const rating = Math.min(5, Math.max(1, Number(formData.get("rating") || 5)));
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();

    if (!productId || !title || !body) {
      return { success: false, error: "Veuillez remplir tous les champs de l'avis." };
    }

    // Vérifier si l'utilisateur a réellement acheté ce produit
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.id,
        },
      },
    });

    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId: user.id,
        },
      },
      update: {
        rating,
        title,
        body,
        status: ReviewStatus.APPROVED, // auto-approuvé ou pending selon politique
        verifiedPurchase: Boolean(hasPurchased),
      },
      create: {
        productId,
        userId: user.id,
        rating,
        title,
        body,
        status: ReviewStatus.APPROVED,
        verifiedPurchase: Boolean(hasPurchased),
      },
    });

    // Recalcul de la moyenne du produit
    const stats = await prisma.review.aggregate({
      where: { productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAvg: Number((stats._avg.rating ?? 0).toFixed(1)),
        ratingCount: stats._count.rating ?? 0,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/avis");
    return { success: true, message: "Merci ! Votre avis a été enregistré." };
  } catch (error) {
    console.error("Erreur ajout avis :", error);
    return { success: false, error: "Erreur lors de l'enregistrement de l'avis." };
  }
}
