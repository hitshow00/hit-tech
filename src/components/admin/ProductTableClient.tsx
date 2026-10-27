"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { ProductFormModal } from "./ProductFormModal";
import { deleteProductAction, updateProductStockAction } from "@/actions/admin";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

interface ProductTableClientProps {
  products: any[];
  categories: any[];
  brands: any[];
}

export function ProductTableClient({
  products,
  categories,
  brands,
}: ProductTableClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<any | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.brand?.name &&
        prod.brand.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || prod.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  async function handleDelete(id: string, name: string) {
    if (confirm(`Voulez-vous vraiment supprimer définitivement « ${name} » ?`)) {
      const res = await deleteProductAction(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || "Erreur lors de la suppression.");
      }
    }
  }

  async function handleQuickStockUpdate(id: string, currentStock: number) {
    const input = prompt("Entrez la nouvelle quantité en stock :", currentStock.toString());
    if (input !== null) {
      const parsed = parseInt(input, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        await updateProductStockAction(id, parsed);
        window.location.reload();
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Barre d'outils supérieure : Recherche, Filtres & Ajout Produit ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-lg">
          {/* Recherche */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, SKU ou marque..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Filtre catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton d'ajout qui ouvre la modale avec upload image */}
        <ProductFormModal categories={categories} brands={brands} />
      </div>

      {/* Modale d'édition si un produit est sélectionné */}
      {selectedProductToEdit && (
        <ProductFormModal
          categories={categories}
          brands={brands}
          productToEdit={selectedProductToEdit}
          onClose={() => setSelectedProductToEdit(null)}
        />
      )}

      {/* ── Tableau Haute Densité Monochrome ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix Public</th>
                <th className="py-3.5 px-4">Disponibilité</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                    Aucun produit ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const mainImage = prod.images?.[0];
                  const isLowStock = prod.stock <= 5;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-zinc-900/40 transition-colors group"
                    >
                      {/* Image miniature & Nom */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative shrink-0 flex items-center justify-center">
                            {mainImage ? (
                              <Image
                                src={mainImage.thumbUrl || mainImage.url}
                                alt={prod.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white block group-hover:text-cyan-400 transition-colors">
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-zinc-500 font-mono">
                                SKU: {prod.sku}
                              </span>
                              {prod.brand?.name && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 font-medium border border-zinc-800">
                                  {prod.brand.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td className="py-3 px-4 text-zinc-400 font-medium">
                        {prod.category?.name || "—"}
                      </td>

                      {/* Prix */}
                      <td className="py-3 px-4">
                        <span className="font-black text-white text-sm">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.compareAtPrice && (
                          <span className="block text-[10px] text-zinc-500 line-through">
                            {formatPrice(prod.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock avec alerte */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleQuickStockUpdate(prod.id, prod.stock)}
                          title="Cliquer pour ajuster le stock"
                          className="flex items-center gap-1.5 group/stock px-2 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors"
                        >
                          {isLowStock ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span
                            className={`font-mono font-bold ${
                              prod.stock === 0
                                ? "text-rose-400"
                                : isLowStock
                                ? "text-amber-400"
                                : "text-zinc-200"
                            }`}
                          >
                            {prod.stock} unités
                          </span>
                        </button>
                      </td>

                      {/* Statut */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            prod.status === "PUBLISHED"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                              : prod.status === "DRAFT"
                              ? "bg-zinc-900 text-zinc-400 border-zinc-800"
                              : "bg-rose-950/60 text-rose-400 border-rose-800/40"
                          }`}
                        >
                          {prod.status === "PUBLISHED"
                            ? "En ligne"
                            : prod.status === "DRAFT"
                            ? "Brouillon"
                            : "Archivé"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/produit/${prod.slug}`}
                            target="_blank"
                            title="Voir la fiche publique"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedProductToEdit(prod)}
                            title="Modifier ce produit"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-cyan-950/80 text-zinc-400 hover:text-cyan-400 transition-colors border border-zinc-800 hover:border-cyan-800/50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Supprimer ce produit"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 transition-colors border border-zinc-800 hover:border-rose-800/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
