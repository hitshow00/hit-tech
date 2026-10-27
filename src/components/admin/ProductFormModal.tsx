"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { saveProductAction } from "@/actions/admin";
import {
  Upload,
  Plus,
  X,
  Loader2,
  Package,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface ProductModalProps {
  categories: Category[];
  brands: Brand[];
  productToEdit?: any;
  onClose?: () => void;
}

export function ProductFormModal({
  categories,
  brands,
  productToEdit,
  onClose,
}: ProductModalProps) {
  const [isOpen, setIsOpen] = useState(!!productToEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Images en prévisualisation locale
  const [selectedImages, setSelectedImages] = useState<{ file: File; previewUrl: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Caractéristiques dynamiques
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    productToEdit?.specs && Array.isArray(productToEdit.specs)
      ? productToEdit.specs
      : [
          { label: "Écran", value: "" },
          { label: "Processeur", value: "" },
          { label: "RAM", value: "" },
          { label: "Stockage", value: "" },
        ]
  );

  // Auto-génération du slug
  const [nameValue, setNameValue] = useState(productToEdit?.name || "");
  const [slugValue, setSlugValue] = useState(productToEdit?.slug || "");

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setNameValue(val);
    if (!productToEdit) {
      setSlugValue(
        val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newItems]);
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  }

  function addSpecField() {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeSpecField(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSpec(index: number, field: "label" | "value", text: string) {
    setSpecs((prev) => {
      const copy = [...prev];
      copy[index][field] = text;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Ajout des caractéristiques sous forme de JSON
    const cleanSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    formData.set("specs", JSON.stringify(cleanSpecs));

    // Ajout des fichiers images
    selectedImages.forEach(({ file }) => {
      formData.append("images", file);
    });

    const res = await saveProductAction(formData);
    setLoading(false);

    if (res.success) {
      setSuccess("Produit enregistré avec succès !");
      setTimeout(() => {
        setIsOpen(false);
        if (onClose) onClose();
        window.location.reload();
      }, 1200);
    } else {
      setError(res.error || "Une erreur est survenue.");
    }
  }

  return (
    <div>
      {!productToEdit && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            {/* Header modal */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {productToEdit ? "Modifier le produit" : "Ajouter un nouveau produit"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Catalogue Hit Tech Maroc • Fiche technique & images
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Notifications retour */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 shrink-0">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Formulaire défilant */}
            <form onSubmit={handleSubmit} className="overflow-y-auto space-y-6 pt-5 pr-1">
              {productToEdit && (
                <input type="hidden" name="id" value={productToEdit.id} />
              )}

              {/* 1. SECTION IMAGES AVEC GLISSER-DÉPOSER & PREVIEWS */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    Photos du produit
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    Format WebP optimisé automatiquement
                  </span>
                </div>

                {/* Zone de Drop / Sélection */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-950/50 group"
                >
                  <Upload className="w-8 h-8 text-zinc-600 group-hover:text-cyan-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-semibold text-zinc-300">
                    Glissez vos photos ici ou{" "}
                    <span className="text-cyan-400 underline">parcourez vos fichiers</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    PNG, JPG, WEBP • Plusieurs photos autorisées
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesSelected}
                    className="hidden"
                  />
                </div>

                {/* Miniatures des photos sélectionnées */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                    {selectedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
                      >
                        <Image
                          src={img.previewUrl}
                          alt="Aperçu"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedImage(idx);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:text-rose-400 hover:bg-black transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500 text-black">
                            Principale
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Si en mode édition : afficher les images déjà existantes */}
                {productToEdit?.images && productToEdit.images.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Images existantes en base :
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {productToEdit.images.map((img: any) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
                        >
                          <Image
                            src={img.thumbUrl || img.url}
                            alt={img.alt || "Produit"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. INFORMATIONS PRINCIPALES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={nameValue}
                    onChange={handleNameChange}
                    placeholder="Ex: iPhone 15 Pro Max 256 Go Titane Naturel"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Slug d&apos;URL *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={slugValue}
                    onChange={(e) => setSlugValue(e.target.value)}
                    placeholder="ex: iphone-15-pro-max-256-go"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Référence SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    defaultValue={
                      productToEdit?.sku ||
                      `HT-${Math.floor(100000 + Math.random() * 900000)}`
                    }
                    placeholder="Ex: HT-IPH15PM-256"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={productToEdit?.categoryId || ""}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="" disabled>
                      Sélectionner une catégorie
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Marque
                  </label>
                  <select
                    name="brandId"
                    defaultValue={productToEdit?.brandId || ""}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Aucune marque spécifique</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. PRIX & STOCKS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Prix de vente (DH) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={productToEdit?.price ? productToEdit.price / 100 : ""}
                    placeholder="Ex: 14500"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Prix barré (DH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="compareAtPrice"
                    defaultValue={
                      productToEdit?.compareAtPrice
                        ? productToEdit.compareAtPrice / 100
                        : ""
                    }
                    placeholder="Ex: 15900"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-zinc-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Quantité en stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    defaultValue={productToEdit?.stock ?? 10}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 4. STATUT & OPTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Statut de publication
                  </label>
                  <select
                    name="status"
                    defaultValue={productToEdit?.status || "PUBLISHED"}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PUBLISHED">En ligne (Publié)</option>
                    <option value="DRAFT">Brouillon (Masqué)</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    value="true"
                    defaultChecked={productToEdit?.featured}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="featured" className="text-xs font-medium text-zinc-300">
                    Mettre en avant (Accueil)
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    value="true"
                    defaultChecked={productToEdit?.isNew ?? true}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="isNew" className="text-xs font-medium text-zinc-300">
                    Badge « Nouveauté »
                  </label>
                </div>
              </div>

              {/* 5. DESCRIPTIONS */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Description courte (Accroche)
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    defaultValue={productToEdit?.shortDescription || ""}
                    placeholder="Ex: Le fleuron d'Apple avec puce A17 Pro et châssis titane."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Description complète
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={productToEdit?.description || ""}
                    placeholder="Détails du produit, points forts, contenu de la boîte..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 6. CARACTÉRISTIQUES TECHNIQUES DYNAMIQUES */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Fiche Technique & Caractéristiques
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Caractéristique (ex: RAM)"
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        className="w-1/3 bg-zinc-900 border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Valeur (ex: 16 Go)"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(i)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons d'action finaux */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900 sticky bottom-0 bg-zinc-950 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{productToEdit ? "Mettre à jour" : "Publier le produit"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
