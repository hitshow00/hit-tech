import Link from "next/link";
import { searchCatalog, getCategories, getBrands } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Search, X, Filter } from "lucide-react";

interface BoutiquePageProps {
  searchParams: Promise<{
    q?: string;
    categorie?: string;
    marque?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const currentCategory = params.categorie?.trim() || "";
  const currentBrand = params.marque?.trim() || "";
  const currentSort = params.sort?.trim() || "newest";
  const minPrice = params.minPrice ? Number(params.minPrice) * 100 : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) * 100 : undefined;

  const [products, categories, brands] = await Promise.all([
    searchCatalog({
      q,
      category: currentCategory || undefined,
      brand: currentBrand || undefined,
      sort: currentSort,
      minPrice,
      maxPrice,
    }),
    getCategories(),
    getBrands(),
  ]);

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header page boutique */}
      <div className="mb-8 pb-6 border-b border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {activeCategoryObj ? "Rayon" : "Catalogue"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              {activeCategoryObj ? activeCategoryObj.name : "Tous nos Produits"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              {activeCategoryObj
                ? activeCategoryObj.description
                : "Sélection d'équipements technologiques et accessoires certifiés."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <strong className="text-white">{products.length}</strong> produit{products.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Sidebar Filtres Monochrome ── */}
        <aside className="lg:col-span-3 space-y-6 bg-zinc-950 p-5 rounded-xl border border-zinc-900">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              Filtres
            </span>
            {(currentCategory || currentBrand || q) && (
              <Link
                href="/boutique"
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Effacer
              </Link>
            )}
          </div>

          {/* Recherche */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Recherche directe
            </label>
            <form action="/boutique" method="GET" className="relative">
              {currentCategory && <input type="hidden" name="categorie" value={currentCategory} />}
              {currentBrand && <input type="hidden" name="marque" value={currentBrand} />}
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Modèle, référence..."
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
            </form>
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Catégories
            </label>
            <div className="space-y-1">
              <Link
                href={{
                  pathname: "/boutique",
                  query: { ...(currentBrand ? { marque: currentBrand } : {}), ...(q ? { q } : {}) },
                }}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  !currentCategory
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <span>Toutes les catégories</span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={{
                    pathname: "/boutique",
                    query: {
                      categorie: c.slug,
                      ...(currentBrand ? { marque: currentBrand } : {}),
                      ...(q ? { q } : {}),
                    },
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    currentCategory === c.slug
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className={`text-[10px] ${currentCategory === c.slug ? "text-zinc-700" : "text-zinc-600"}`}>
                    {c.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Marques */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Marques
            </label>
            <div className="space-y-1">
              <Link
                href={{
                  pathname: "/boutique",
                  query: { ...(currentCategory ? { categorie: currentCategory } : {}), ...(q ? { q } : {}) },
                }}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  !currentBrand
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <span>Toutes les marques</span>
              </Link>
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={{
                    pathname: "/boutique",
                    query: {
                      marque: b.slug,
                      ...(currentCategory ? { categorie: currentCategory } : {}),
                      ...(q ? { q } : {}),
                    },
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    currentBrand === b.slug
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span>{b.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Ordre d&apos;affichage
            </label>
            <div className="space-y-1 text-xs">
              {[
                { label: "Nouveautés", value: "newest" },
                { label: "Populaires", value: "popular" },
                { label: "Prix croissant", value: "price-asc" },
                { label: "Prix décroissant", value: "price-desc" },
                { label: "Mieux notés", value: "rating" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={{
                    pathname: "/boutique",
                    query: {
                      ...(currentCategory ? { categorie: currentCategory } : {}),
                      ...(currentBrand ? { marque: currentBrand } : {}),
                      ...(q ? { q } : {}),
                      sort: opt.value,
                    },
                  }}
                  className={`block px-3 py-1.5 rounded-lg transition-colors ${
                    currentSort === opt.value
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Grille Produits ── */}
        <main className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="rounded-2xl bg-zinc-950 p-12 text-center flex flex-col items-center justify-center gap-4 border border-zinc-900">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Aucun produit trouvé</h3>
              <p className="text-xs text-zinc-500 max-w-sm">
                Veuillez élargir vos filtres ou modifier votre terme de recherche.
              </p>
              <Link
                href="/boutique"
                className="px-5 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
              >
                Réinitialiser
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
