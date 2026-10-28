"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  ExternalLink,
  LayoutDashboard,
  X,
  Loader2,
} from "lucide-react";
import { quickSearchAdminAction } from "@/actions/admin";
import { formatPrice } from "@/lib/currency";

export function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: any[];
    orders: any[];
    users: any[];
  }>({ products: [], orders: [], users: [] });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Écouteur clavier Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Débounce de recherche
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults({ products: [], orders: [], users: [] });
      return;
    }

    if (query.trim().length < 2) {
      setResults({ products: [], orders: [], users: [] });
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await quickSearchAdminAction(query);
        setResults(res);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const navigateTo = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const navShortcuts = [
    { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
    { name: "Commandes & Expéditions", href: "/admin/commandes", icon: ShoppingBag },
    { name: "Catalogue & Stocks", href: "/admin/produits", icon: Package },
    { name: "Promotions & Réductions", href: "/admin/promotions", icon: Tag },
    { name: "Modération des Avis", href: "/admin/avis", icon: Star },
    { name: "Comptes Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer shadow-sm group"
        title="Recherche rapide (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
        <span className="hidden sm:inline">Recherche rapide...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
          ⌘K
        </kbd>
      </button>
    );
  }

  const hasResults =
    results.products.length > 0 ||
    results.orders.length > 0 ||
    results.users.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] divide-y divide-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Champ de recherche */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Rechercher produit, commande, client ou action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          {isPending && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin shrink-0" />}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps des résultats */}
        <div className="p-2 overflow-y-auto space-y-4">
          {query.trim().length >= 2 ? (
            hasResults ? (
              <div className="space-y-4">
                {/* Produits trouvés */}
                {results.products.length > 0 && (
                  <div>
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Produits
                    </span>
                    <div className="mt-1 space-y-1">
                      {results.products.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => navigateTo(`/admin/produits?search=${encodeURIComponent(p.sku)}`)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package className="w-4 h-4 text-cyan-400" />
                            <div>
                              <p className="text-xs font-semibold text-white group-hover:text-cyan-400">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                SKU: {p.sku} • Stock: {p.stock}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white">
                            {formatPrice(p.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commandes trouvées */}
                {results.orders.length > 0 && (
                  <div>
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Commandes
                    </span>
                    <div className="mt-1 space-y-1">
                      {results.orders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => navigateTo(`/admin/commandes/${o.id}`)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-4 h-4 text-blue-400" />
                            <div>
                              <p className="text-xs font-semibold text-white group-hover:text-blue-400">
                                Commande {o.number}
                              </p>
                              <p className="text-[10px] text-zinc-500">
                                Client : {o.shipFullName} • {o.status}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white">
                            {formatPrice(o.total)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clients trouvés */}
                {results.users.length > 0 && (
                  <div>
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Utilisateurs
                    </span>
                    <div className="mt-1 space-y-1">
                      {results.users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => navigateTo(`/admin/utilisateurs?search=${encodeURIComponent(u.email)}`)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-emerald-400" />
                            <div>
                              <p className="text-xs font-semibold text-white group-hover:text-emerald-400">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-[10px] text-zinc-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : !isPending ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Aucun résultat trouvé pour « {query} »
              </div>
            ) : null
          ) : (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Navigation rapide
              </span>
              <div className="mt-1 space-y-0.5">
                {navShortcuts.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.href}
                      onClick={() => navigateTo(s.href)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4 text-zinc-400" />
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Hit Tech Admin Search</span>
          <span>Échap pour fermer</span>
        </div>
      </div>
    </div>
  );
}
