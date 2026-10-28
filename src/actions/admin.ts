"use server";

import { revalidatePath } from "next/cache";
import { prisma, Role, ProductStatus, OrderStatus, PaymentStatus, ReviewStatus, DiscountType } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { processAndSaveProductImage } from "@/lib/images";

// ─────────────────────────── PRODUITS ───────────────────────────

export async function saveProductAction(formData: FormData) {
  try {
    const admin = await requireStaffOrAdmin();

    const id = String(formData.get("id") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const sku = String(formData.get("sku") || "").trim().toUpperCase();
    const categoryId = String(formData.get("categoryId") || "").trim();
    const brandId = String(formData.get("brandId") || "").trim() || null;
    const priceMAD = Number(formData.get("price") || 0);
    const compareAtPriceMAD = formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null;
    const stock = Math.max(0, parseInt(String(formData.get("stock") || "0"), 10));
    const status = (String(formData.get("status") || "DRAFT") as ProductStatus);
    const featured = formData.get("featured") === "true";
    const isNew = formData.get("isNew") === "true";
    const shortDescription = String(formData.get("shortDescription") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const warrantyMonths = formData.get("warrantyMonths") ? parseInt(String(formData.get("warrantyMonths")), 10) : null;
    const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
    const seoDescription = String(formData.get("seoDescription") || "").trim() || null;

    // Caractéristiques techniques (JSON)
    const specsRaw = String(formData.get("specs") || "[]");
    let specs = [];
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      specs = [];
    }

    if (!name || !slug || !sku || !categoryId || priceMAD <= 0) {
      return { success: false, error: "Veuillez renseigner le nom, le slug, le SKU, la catégorie et un prix valide." };
    }

    const priceCentimes = Math.round(priceMAD * 100);
    const compareAtPriceCentimes = compareAtPriceMAD ? Math.round(compareAtPriceMAD * 100) : null;

    let product;
    if (id) {
      product = await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          sku,
          categoryId,
          brandId,
          price: priceCentimes,
          compareAtPrice: compareAtPriceCentimes,
          stock,
          status,
          featured,
          isNew,
          shortDescription: shortDescription || null,
          description,
          warrantyMonths,
          specs,
          seoTitle,
          seoDescription,
        },
      });

      await logAudit({
        userId: admin.id,
        action: "product.update",
        entityType: "Product",
        entityId: product.id,
        summary: `Modification du produit « ${product.name} » (Stock: ${stock}, Prix: ${priceMAD} DH)`,
      });
    } else {
      product = await prisma.product.create({
        data: {
          name,
          slug,
          sku,
          categoryId,
          brandId,
          price: priceCentimes,
          compareAtPrice: compareAtPriceCentimes,
          stock,
          status,
          featured,
          isNew,
          shortDescription: shortDescription || null,
          description,
          warrantyMonths,
          specs,
          seoTitle,
          seoDescription,
          publishedAt: status === ProductStatus.PUBLISHED ? new Date() : null,
        },
      });

      await logAudit({
        userId: admin.id,
        action: "product.create",
        entityType: "Product",
        entityId: product.id,
        summary: `Création du nouveau produit « ${product.name} »`,
      });
    }

    // Gestion des images téléversées (une ou plusieurs)
    const imageFiles = formData.getAll("images") as File[];
    const singleImage = formData.get("image") as File | null;
    const allImages: File[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const f of imageFiles) {
        if (f && f.size > 0 && f.type.startsWith("image/")) {
          allImages.push(f);
        }
      }
    }
    if (singleImage && singleImage.size > 0 && singleImage.type.startsWith("image/")) {
      if (!allImages.some(img => img.name === singleImage.name && img.size === singleImage.size)) {
        allImages.push(singleImage);
      }
    }

    if (allImages.length > 0) {
      const currentImagesCount = await prisma.productImage.count({
        where: { productId: product.id },
      });

      for (let i = 0; i < allImages.length; i++) {
        const file = allImages[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const imgInfo = await processAndSaveProductImage(buffer, `${product.slug}-${i}`);

        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imgInfo.url,
            mediumUrl: imgInfo.mediumUrl,
            thumbUrl: imgInfo.thumbUrl,
            width: imgInfo.width,
            height: imgInfo.height,
            alt: `${product.name} - Vue ${currentImagesCount + i + 1}`,
            position: currentImagesCount + i,
          },
        });
      }
    }

    revalidatePath("/admin/produits");
    revalidatePath(`/boutique`);
    revalidatePath(`/produit/${product.slug}`);

    return { success: true, productId: product.id };
  } catch (error: any) {
    console.error("Erreur enregistrement produit :", error);
    return { success: false, error: error?.message || "Impossible d'enregistrer le produit." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const admin = await requireStaffOrAdmin();
    const product = await prisma.product.delete({ where: { id } });

    await logAudit({
      userId: admin.id,
      action: "product.delete",
      entityType: "Product",
      entityId: id,
      summary: `Suppression du produit « ${product.name} »`,
    });

    revalidatePath("/admin/produits");
    revalidatePath("/boutique");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Impossible de supprimer ce produit (des commandes y sont peut-être rattachées)." };
  }
}

export async function deleteProductImageAction(imageId: string) {
  try {
    const admin = await requireStaffOrAdmin();
    const image = await prisma.productImage.delete({
      where: { id: imageId },
      include: { product: true },
    });

    await logAudit({
      userId: admin.id,
      action: "product.image_delete",
      entityType: "ProductImage",
      entityId: imageId,
      summary: `Suppression d'une image du produit « ${image.product.name} »`,
    });

    revalidatePath("/admin/produits");
    revalidatePath(`/produit/${image.product.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur suppression image." };
  }
}

export async function updateProductStockAction(id: string, newStock: number) {
  try {
    const admin = await requireStaffOrAdmin();
    const product = await prisma.product.update({
      where: { id },
      data: { stock: Math.max(0, newStock) },
    });

    await logAudit({
      userId: admin.id,
      action: "product.stock",
      entityType: "Product",
      entityId: id,
      summary: `Mise à jour du stock pour « ${product.name} » : ${newStock}`,
    });

    revalidatePath("/admin/produits");
    revalidatePath(`/produit/${product.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur mise à jour stock" };
  }
}

// ─────────────────────────── COMMANDES ───────────────────────────

export async function updateOrderStatusAction(orderId: string, newStatus: OrderStatus, note?: string) {
  try {
    const admin = await requireStaffOrAdmin();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentStatus:
          newStatus === OrderStatus.DELIVERED && orderId
            ? PaymentStatus.PAID
            : undefined,
        history: {
          create: {
            status: newStatus,
            note: note || `Statut passé à ${newStatus}`,
            createdBy: admin.id,
          },
        },
      },
    });

    await logAudit({
      userId: admin.id,
      action: "order.status",
      entityType: "Order",
      entityId: order.id,
      summary: `Commande ${order.number} : statut passé à ${newStatus}`,
      details: { status: newStatus, note },
    });

    revalidatePath(`/admin/commandes`);
    revalidatePath(`/admin/commandes/${orderId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur mise à jour commande" };
  }
}

export async function updateOrderTrackingAction(orderId: string, trackingNumber: string, carrier: string) {
  try {
    const admin = await requireStaffOrAdmin();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: trackingNumber.trim() || null,
        carrier: carrier.trim() || null,
      },
    });

    await logAudit({
      userId: admin.id,
      action: "order.tracking",
      entityType: "Order",
      entityId: order.id,
      summary: `Commande ${order.number} : numéro de suivi mis à jour (${trackingNumber})`,
    });

    revalidatePath(`/admin/commandes/${orderId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur enregistrement suivi" };
  }
}

// ─────────────────────────── AVIS ───────────────────────────

export async function updateReviewStatusAction(reviewId: string, newStatus: ReviewStatus) {
  try {
    const admin = await requireStaffOrAdmin();

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status: newStatus },
      include: { product: true },
    });

    // Recalculer la note moyenne du produit
    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        ratingAvg: Number((stats._avg.rating ?? 0).toFixed(1)),
        ratingCount: stats._count.rating ?? 0,
      },
    });

    await logAudit({
      userId: admin.id,
      action: "review.status",
      entityType: "Review",
      entityId: review.id,
      summary: `Avis sur « ${review.product.name} » : passé à ${newStatus}`,
    });

    revalidatePath(`/admin/avis`);
    revalidatePath(`/produit/${review.product.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur mise à jour avis" };
  }
}

// ─────────────────────────── CODES PROMO ───────────────────────────

export async function saveDiscountAction(formData: FormData) {
  try {
    const admin = await requireStaffOrAdmin();

    const id = String(formData.get("id") || "").trim();
    const code = String(formData.get("code") || "").trim().toUpperCase();
    const description = String(formData.get("description") || "").trim();
    const type = (String(formData.get("type") || "PERCENT") as DiscountType);
    const value = Math.max(1, parseInt(String(formData.get("value") || "10"), 10));
    const minSubtotalMAD = Number(formData.get("minSubtotal") || 0);
    const maxUses = formData.get("maxUses") ? parseInt(String(formData.get("maxUses")), 10) : null;
    const isActive = formData.get("isActive") === "true";

    if (!code) {
      return { success: false, error: "Le code est obligatoire." };
    }

    const valueStored = type === "FIXED" ? Math.round(value * 100) : value;
    const minSubtotalStored = Math.round(minSubtotalMAD * 100);

    if (id) {
      await prisma.discountCode.update({
        where: { id },
        data: {
          code,
          description: description || null,
          type,
          value: valueStored,
          minSubtotal: minSubtotalStored,
          maxUses,
          isActive,
        },
      });
    } else {
      await prisma.discountCode.create({
        data: {
          code,
          description: description || null,
          type,
          value: valueStored,
          minSubtotal: minSubtotalStored,
          maxUses,
          isActive,
        },
      });
    }

    await logAudit({
      userId: admin.id,
      action: id ? "discount.update" : "discount.create",
      entityType: "DiscountCode",
      summary: `Code promo ${code} (${type === "PERCENT" ? `${value}%` : `${value} DH`})`,
    });

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Erreur enregistrement code promo" };
  }
}

export async function toggleDiscountAction(id: string, isActive: boolean) {
  try {
    await requireStaffOrAdmin();
    await prisma.discountCode.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur" };
  }
}

export async function deleteDiscountAction(id: string) {
  try {
    const admin = await requireStaffOrAdmin();
    const discount = await prisma.discountCode.delete({
      where: { id },
    });

    await logAudit({
      userId: admin.id,
      action: "discount.delete",
      entityType: "DiscountCode",
      entityId: id,
      summary: `Suppression du code promo ${discount.code}`,
    });

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Impossible de supprimer ce code promo." };
  }
}

// ─────────────────────────── ACTIONS GROUPÉES COMMANDES ───────────────────────────

export async function bulkUpdateOrderStatusAction(orderIds: string[], newStatus: OrderStatus) {
  try {
    const admin = await requireStaffOrAdmin();
    if (!orderIds.length) return { success: false, error: "Aucune commande sélectionnée" };

    await prisma.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: { id: { in: orderIds } },
        data: {
          status: newStatus,
          paymentStatus: newStatus === OrderStatus.DELIVERED ? PaymentStatus.PAID : undefined,
        },
      });

      for (const orderId of orderIds) {
        await tx.orderStatusHistory.create({
          data: {
            orderId,
            status: newStatus,
            note: `Mise à jour groupée vers ${newStatus}`,
            createdBy: admin.id,
          },
        });
      }
    });

    await logAudit({
      userId: admin.id,
      action: "order.bulk_status",
      entityType: "Order",
      summary: `Mise à jour groupée de ${orderIds.length} commande(s) vers ${newStatus}`,
    });

    revalidatePath("/admin/commandes");
    return { success: true, count: orderIds.length };
  } catch (error: any) {
    console.error("Erreur bulk status :", error);
    return { success: false, error: error?.message || "Erreur mise à jour groupée" };
  }
}

// ─────────────────────────── GESTION UTILISATEURS ───────────────────────────

export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  try {
    const admin = await requireStaffOrAdmin();
    if (admin.id === userId) {
      return { success: false, error: "Vous ne pouvez pas modifier votre propre compte." };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    await logAudit({
      userId: admin.id,
      action: "user.toggle_active",
      entityType: "User",
      entityId: userId,
      summary: `${isActive ? "Activation" : "Désactivation"} du compte ${updated.email}`,
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors de la modification de l'utilisateur." };
  }
}

export async function updateUserRoleAction(userId: string, role: Role) {
  try {
    const admin = await requireStaffOrAdmin();
    if (admin.id === userId) {
      return { success: false, error: "Vous ne pouvez pas modifier votre propre rôle." };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await logAudit({
      userId: admin.id,
      action: "user.change_role",
      entityType: "User",
      entityId: userId,
      summary: `Attribution du rôle ${role} à ${updated.email}`,
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors du changement de rôle." };
  }
}

// ─────────────────────────── RECHERCHE UNIVERSELLE (COMMAND PALETTE) ───────────────────────────

export async function quickSearchAdminAction(query: string) {
  try {
    await requireStaffOrAdmin();
    const q = query.trim();
    if (!q || q.length < 2) {
      return { products: [], orders: [], users: [] };
    }

    const [products, orders, users] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, slug: true, sku: true, price: true, stock: true },
      }),
      prisma.order.findMany({
        where: {
          OR: [
            { number: { contains: q, mode: "insensitive" } },
            { shipFullName: { contains: q, mode: "insensitive" } },
            { shipPhone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, number: true, shipFullName: true, total: true, status: true, createdAt: true },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      }),
    ]);

    return { products, orders, users };
  } catch (error) {
    return { products: [], orders: [], users: [] };
  }
}
