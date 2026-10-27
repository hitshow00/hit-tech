import { prisma } from "@/lib/prisma";
import { ProductTableClient } from "@/components/admin/ProductTableClient";
import { Package, Plus } from "lucide-react";

export const metadata = {
  title: "Gestion des Produits & Stock | Admin Hit Tech",
};

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { position: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* ── En-tête de section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Inventaire & Catalogue
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Produits ({products.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gérez vos références, tarifs, stocks et téléversez les visuels en direct.
          </p>
        </div>
      </div>

      {/* ── Composant Client : Tableau & Modale d'ajout ── */}
      <ProductTableClient
        products={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
