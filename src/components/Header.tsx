import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";
import { Role } from "@/lib/prisma";
import { SpatialMobileMenu } from "./SpatialMobileMenu";
import { ScrollRevealHeader } from "./ScrollRevealHeader";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  ShoppingBag,
  User as UserIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export async function Header() {
  let user = null;
  let cartSummary = null;

  try {
    const authResult = await getCurrentUser();
    user = authResult.user;
  } catch (e: any) {
    if (e?.digest === "DYNAMIC_SERVER_USAGE" || e?.digest?.startsWith?.("NEXT_")) {
      throw e;
    }
  }

  try {
    cartSummary = await getCartSummary(user?.id);
  } catch (e: any) {
    if (e?.digest === "DYNAMIC_SERVER_USAGE" || e?.digest?.startsWith?.("NEXT_")) {
      throw e;
    }
  }

  const itemCount = cartSummary?.itemCount ?? 0;
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.STAFF;

  return (
    <ScrollRevealHeader>
      <header className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200 shadow-sm dark:shadow-none">
        {/* Ligne d'accent luminescent cyan spatial sur la bordure basse */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none" />

        {/* Barre de Navigation Principale */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* ── 1. LOGO & MONOGRAMME HIT TECH STATUTAIRE ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs tracking-wider transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                color: "#ffffff",
                boxShadow: "0 0 16px rgba(34, 211, 238, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              HT
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm uppercase tracking-wider text-zinc-950 dark:text-white transition-colors">
                Hit Tech
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                PRO
              </span>
            </div>
          </Link>

          {/* ── 2. ONGLETS DE CATÉGORIES (DESKTOP) ── */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full shadow-sm dark:shadow-lg bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md">
            <Link
              href="/boutique"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.12] transition-all"
            >
              Catalogue
            </Link>
            <Link
              href="/boutique?categorie=smartphones"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Smartphones</span>
            </Link>
            <Link
              href="/boutique?categorie=pc-portables"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>PC Portables</span>
            </Link>
            <Link
              href="/boutique?categorie=tablettes"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            >
              <Tablet className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Tablettes</span>
            </Link>
            <Link
              href="/boutique?categorie=audio-casques"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Audio</span>
            </Link>
          </div>

          {/* ── 3. RECHERCHE & ACTIONS UTILISATEUR ── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Barre de Recherche Translucide */}
            <form action="/boutique" method="GET" className="relative hidden md:flex items-center">
              <input
                type="text"
                name="q"
                placeholder="Rechercher..."
                className="w-36 lg:w-48 focus:w-64 rounded-full py-1.5 pl-8 pr-10 text-xs bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-zinc-400 pointer-events-none" />
              <span className="absolute right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-300/50 dark:border-zinc-700/50 pointer-events-none">
                ⌘K
              </span>
            </form>

            {/* Bouton Panneau Administrateur */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-102 bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                title="Tableau de bord administrateur"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Compte Utilisateur / Connexion */}
            <Link
              href={user ? "/compte" : "/compte/connexion"}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-102 bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{user ? user.firstName : "Connexion"}</span>
            </Link>

            {/* Capsule Panier Statutaire */}
            <Link
              href="/panier"
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all hover:scale-105 active:scale-95 bg-zinc-950 dark:bg-white text-white dark:text-black shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white dark:text-black" />
              <span>Panier</span>
              {itemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white dark:bg-black text-black dark:text-white text-[10px] font-black flex items-center justify-center -mr-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu Mobile */}
            <SpatialMobileMenu
              user={user ? { firstName: user.firstName, role: user.role } : null}
              itemCount={itemCount}
              isAdmin={isAdmin}
            />
          </div>

        </nav>
      </header>
    </ScrollRevealHeader>
  );
}
