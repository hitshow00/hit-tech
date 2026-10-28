"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Eye,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";

interface AdminSidebarProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      group: "Vue d'ensemble",
      items: [
        { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "Ventes & Logistique",
      items: [
        { name: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
      ],
    },
    {
      group: "Catalogue Hit Tech",
      items: [
        { name: "Produits & Stock", href: "/admin/produits", icon: Package },
        { name: "Promotions & Codes", href: "/admin/promotions", icon: Tag },
        { name: "Avis Clients", href: "/admin/avis", icon: Star },
      ],
    },
    {
      group: "Sécurité & Accès",
      items: [
        { name: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-zinc-950 border-r border-zinc-900 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen select-none">
      {/* Haut : Logo & Navigation */}
      <div className="space-y-4">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pt-2 pb-3 border-b border-zinc-900">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              HT
            </div>
            <div>
              <span className="font-black text-sm tracking-wider text-white uppercase block leading-none">
                Hit Tech
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Command Palette Trigger */}
        <div className="px-1">
          <AdminCommandPalette />
        </div>

        {/* Liens organisés par groupe */}
        <nav className="space-y-4">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {group.group}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-zinc-900 text-white border border-zinc-800 shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-cyan-400" : "text-zinc-500"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bas : Raccourci boutique & Profil admin */}
      <div className="pt-4 border-t border-zinc-900 space-y-3">
        <Link
          href="/boutique"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Voir la boutique</span>
          </div>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </Link>

        {/* Profil & Déconnexion */}
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
              {user.firstName.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block truncate">
                {user.role}
              </span>
            </div>
          </div>

          <form
            action={async () => {
              await logoutAction();
            }}
          >
            <button
              type="submit"
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
