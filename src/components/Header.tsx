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
            <span
              className="font-black text-sm uppercase transition-colors"
              style={{ color: "#ffffff", letterSpacing: "0.12em" }}
            >
              Hit Tech
            </span>
            <span
              className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold"
              style={{
                backgroundColor: "rgba(8, 51, 68, 0.75)",
                border: "1px solid rgba(6, 182, 212, 0.55)",
                color: "#22d3ee",
                boxShadow: "0 0 8px rgba(34, 211, 238, 0.25)",
              }}
            >
              PRO
            </span>
          </div>
        </Link>

        {/* ── 2. ONGLETS DE CATÉGORIES SPATIAUX CLAIRS & NETS (DESKTOP) ── */}
        <div
          className="hidden lg:flex items-center gap-1 p-1 rounded-full shadow-lg"
          style={{
            backgroundColor: "rgba(18, 18, 20, 0.80)",
            border: "1px solid rgba(63, 63, 70, 0.50)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/boutique"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-white/[0.12] transition-all"
            style={{ color: "#f4f4f5" }}
          >
            Catalogue
          </Link>
          <Link
            href="/boutique?categorie=smartphones"
            className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            style={{ color: "#f4f4f5" }}
          >
            <Smartphone className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            <span>Smartphones</span>
          </Link>
          <Link
            href="/boutique?categorie=pc-portables"
            className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            style={{ color: "#f4f4f5" }}
          >
            <Laptop className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            <span>PC Portables</span>
          </Link>
          <Link
            href="/boutique?categorie=tablettes"
            className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            style={{ color: "#f4f4f5" }}
          >
            <Tablet className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            <span>Tablettes</span>
          </Link>
          <Link
            href="/boutique?categorie=audio-casques"
            className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/[0.12] transition-all flex items-center gap-1.5"
            style={{ color: "#f4f4f5" }}
          >
            <Headphones className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            <span>Audio</span>
          </Link>
        </div>

        {/* ── 3. RECHERCHE SPATIALE DISCRÈTE & ACTIONS UTILISATEUR ── */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Capsule de Recherche Translucide Sombre (Pas de bloc blanc aveuglant) */}
          <form action="/boutique" method="GET" className="relative hidden md:flex items-center">
            <input
              type="text"
              name="q"
              placeholder="Rechercher..."
              className="w-36 lg:w-48 focus:w-64 rounded-full py-1.5 pl-8 pr-10 text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
              style={{
                backgroundColor: "rgba(24, 24, 27, 0.75)",
                border: "1px solid rgba(82, 82, 91, 0.55)",
                color: "#ffffff",
              }}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 pointer-events-none" style={{ color: "#a1a1aa" }} />
            <span
              className="absolute right-2 px-1.5 py-0.5 rounded text-[9px] font-mono pointer-events-none"
              style={{
                backgroundColor: "rgba(39, 39, 42, 0.8)",
                border: "1px solid rgba(82, 82, 91, 0.4)",
                color: "#a1a1aa",
              }}
            >
              ⌘K
            </span>
          </form>

          {/* Toggle Thème Sombre / Blanc */}
          <div className="hidden sm:flex items-center">
            <ThemeToggle className="rounded-full bg-zinc-900/80 hover:bg-zinc-800 border-zinc-700/60 text-white" />
          </div>

          {/* Bouton Panneau Administrateur */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-102"
              style={{
                backgroundColor: "rgba(8, 51, 68, 0.75)",
                border: "1px solid rgba(6, 182, 212, 0.55)",
                color: "#22d3ee",
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.2)",
              }}
              title="Tableau de bord administrateur"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Compte Utilisateur / Connexion Élégant */}
          <Link
            href={user ? "/compte" : "/compte/connexion"}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-102"
            style={{
              backgroundColor: "rgba(24, 24, 27, 0.75)",
              border: "1px solid rgba(82, 82, 91, 0.55)",
              color: "#f4f4f5",
            }}
          >
            <UserIcon className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
            <span>{user ? user.firstName : "Connexion"}</span>
          </Link>

          {/* Capsule Panier Blanche Luminescente (Seul point lumineux roi) */}
          <Link
            href="/panier"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              boxShadow: "0 0 25px rgba(255, 255, 255, 0.35)",
            }}
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
