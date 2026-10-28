"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User as UserIcon,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

interface SpatialMobileMenuProps {
  user: { firstName?: string; role?: string } | null;
  itemCount: number;
  isAdmin: boolean;
}

export function SpatialMobileMenu({
  user,
  itemCount,
  isAdmin,
}: SpatialMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Verrouille le scroll arrière-plan quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="flex md:hidden items-center gap-2">
      {/* Bouton Panier Rapide Mobile */}
      <Link
        href="/panier"
        className="relative p-2 rounded-full bg-white/[0.08] border border-white/15 text-white active:scale-95 transition-all"
        aria-label="Voir le panier"
      >
        <ShoppingBag className="w-4 h-4 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_#22d3ee]">
            {itemCount}
          </span>
        )}
      </Link>

      {/* Déclencheur Menu Hamburger Spatial */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/[0.08] border border-white/15 text-white hover:bg-white/[0.15] active:scale-95 transition-all"
        aria-label="Ouvrir le menu"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Tiroir Spatial Flottant Plein Écran */}
      {isOpen && (
        <div className="fixed inset-0 top-[60px] z-50 bg-black/95 backdrop-blur-3xl flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-6">
            {/* Barre de Recherche Mobile */}
            <form action="/boutique" method="GET" onSubmit={() => setIsOpen(false)}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="q"
                  placeholder="Rechercher un produit, marque..."
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              </div>
            </form>

            {/* Univers du Catalogue (Pillules Spatiales) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 px-1">
                Univers Produits
              </span>
              <Link
                href="/boutique"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors"
              >
                <span>Tous les produits</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/boutique?categorie=smartphones"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Smartphones</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/boutique?categorie=pc-portables"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>PC Portables</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/boutique?categorie=tablettes"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Tablet className="w-4 h-4 text-cyan-400" />
                  <span>Tablettes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/boutique?categorie=audio-casques"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-cyan-400" />
                  <span>Audio &amp; Casques</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </div>

            {/* Accès Rapides */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 px-1">
                Espace &amp; Services
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={user ? "/compte" : "/compte/connexion"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs font-medium"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{user ? user.firstName : "Connexion"}</span>
                </Link>
                <Link
                  href="/panier"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white text-black text-xs font-bold"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-black" />
                  <span>Panier ({itemCount})</span>
                </Link>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-950/80 border border-cyan-700/70 text-cyan-300 text-xs font-bold mt-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Panneau Administrateur</span>
                </Link>
              )}
            </div>
          </div>

          {/* Pied de Menu Mobile avec Réassurance */}
          <div className="pt-6 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/suivi" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                Suivi de commande
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                Support WhatsApp
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>Garantie constructeur officielle Maroc</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

