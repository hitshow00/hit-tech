import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCartSummary } from "@/lib/cart";
import { Role } from "@/lib/prisma";
import { ThemeToggle } from "./ThemeToggle";
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
  const { user } = await getCurrentUser();
  const cartSummary = await getCartSummary(user?.id);
  const itemCount = cartSummary?.itemCount ?? 0;
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.STAFF;

  return (
    <header className="sticky top-0 z-40 w-full header-theme backdrop-blur-md transition-colors">
      {/* Barre Principale de Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Logo HIT TECH */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg btn-theme-primary flex items-center justify-center font-black text-sm tracking-wider group-hover:scale-105 transition-transform">
              HT
            </div>
            <span className="font-extrabold text-lg tracking-wider text-main uppercase">
              Hit Tech
            </span>
          </Link>

          {/* Barre de Recherche Épurée */}
          <form
            action="/boutique"
            method="GET"
            className="flex-1 max-w-lg hidden md:flex items-center relative"
          >
            <input
              type="text"
              name="q"
              placeholder="Rechercher un produit, marque, modèle..."
              className="w-full input-theme rounded-lg py-2 pl-9 pr-20 text-xs text-main placeholder-muted transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 badge-theme text-main text-xs font-medium rounded transition-colors"
            >
              Rechercher
            </button>
          </form>

          {/* Actions : Thème Dark/White, Compte, Admin, Panier */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg badge-theme text-main text-xs font-medium hover:border-theme transition-colors"
                title="Tableau de bord administrateur"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <Link
              href={user ? "/compte" : "/compte/connexion"}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg badge-theme text-main text-xs font-medium transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {user ? user.firstName : "Connexion"}
              </span>
            </Link>

            <Link
              href="/panier"
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg btn-theme-primary text-xs font-bold transition-all shadow-sm"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Panier</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-current rounded-full">
                  <span className="text-inverted">{itemCount}</span>
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Barre des Catégories Minimaliste */}
        <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-theme overflow-x-auto no-scrollbar gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/boutique"
              className="text-secondary hover:text-main font-medium transition-colors"
            >
              Tous les produits
            </Link>
            <Link
              href="/boutique?categorie=smartphones"
              className="flex items-center gap-1.5 text-secondary hover:text-main transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-muted" />
              Smartphones
            </Link>
            <Link
              href="/boutique?categorie=pc-portables"
              className="flex items-center gap-1.5 text-secondary hover:text-main transition-colors"
            >
              <Laptop className="w-3.5 h-3.5 text-muted" />
              PC Portables
            </Link>
            <Link
              href="/boutique?categorie=tablettes"
              className="flex items-center gap-1.5 text-secondary hover:text-main transition-colors"
            >
              <Tablet className="w-3.5 h-3.5 text-muted" />
              Tablettes
            </Link>
            <Link
              href="/boutique?categorie=audio-casques"
              className="flex items-center gap-1.5 text-secondary hover:text-main transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-muted" />
              Audio & Casques
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5 text-muted text-xs shrink-0">
            <Link href="/suivi" className="hover:text-main transition-colors">
              Suivi de commande
            </Link>
            <Link href="/contact" className="hover:text-main transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
