import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";
import { Role } from "@/lib/prisma";
import { ThemeToggle } from "./ThemeToggle";
import { SpatialMobileMenu } from "./SpatialMobileMenu";
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
    <header className="sticky top-0 z-40 w-full header-theme transition-all">
      {/* Ligne d'accent luminescent cyan spatial sur la bordure basse */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent pointer-events-none" />

      {/* Barre de Navigation Principale Spatiale */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* ── 1. LOGO & MONOGRAMME HIT TECH ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/20 text-white font-black text-xs flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_14px_rgba(34,211,238,0.25)] group-hover:scale-105 transition-all">
            HT
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-widest text-white uppercase group-hover:text-zinc-200 transition-colors">
              Hit Tech
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-[9px] font-mono text-cyan-300 font-bold">
              PRO
            </span>
          </div>
        </Link>

        {/* ── 2. ONGLETS DE CATÉGORIES SPATIAUX (DESKTOP) ── */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Link
            href="/boutique"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all"
          >
            Catalogue
          </Link>
          <Link
            href="/boutique?categorie=smartphones"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smartphones</span>
          </Link>
          <Link
            href="/boutique?categorie=pc-portables"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            <span>PC Portables</span>
          </Link>
          <Link
            href="/boutique?categorie=tablettes"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
          >
            <Tablet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tablettes</span>
          </Link>
          <Link
            href="/boutique?categorie=audio-casques"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all flex items-center gap-1.5"
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audio</span>
          </Link>
        </div>

        {/* ── 3. RECHERCHE SPATIALE & ACTIONS UTILISATEUR ── */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Capsule de Recherche Dynamique (Desktop & Tablette) */}
          <form action="/boutique" method="GET" className="relative hidden md:flex items-center">
            <input
              type="text"
              name="q"
              placeholder="Rechercher..."
              className="w-36 lg:w-48 focus:w-64 bg-white/[0.05] hover:bg-white/[0.08] focus:bg-black/90 border border-white/15 focus:border-cyan-400/70 rounded-full py-1.5 pl-8 pr-10 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <span className="absolute right-2 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-[9px] font-mono text-zinc-400 pointer-events-none">
              ⌘K
            </span>
          </form>

          {/* Toggle Thème Sombre / Blanc */}
          <div className="hidden sm:flex items-center">
            <ThemeToggle className="rounded-full bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-white" />
          </div>

          {/* Bouton Panneau Administrateur */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              title="Tableau de bord administrateur"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Compte Utilisateur / Connexion */}
          <Link
            href={user ? "/compte" : "/compte/connexion"}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <UserIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>{user ? user.firstName : "Connexion"}</span>
          </Link>

          {/* Capsule Panier Blanche Luminescente */}
          <Link
            href="/panier"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-black" />
            <span>Panier</span>
            {itemCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center -mr-1">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Menu Mobile Spatial Réactif */}
          <SpatialMobileMenu
            user={user ? { firstName: user.firstName, role: user.role } : null}
            itemCount={itemCount}
            isAdmin={isAdmin}
          />
        </div>

      </nav>
    </header>
  );
}
