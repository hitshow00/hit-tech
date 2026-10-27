import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma, OrderStatus, Role } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { logoutAction } from "@/actions/auth";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

export default async function ComptePage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/compte/connexion");
  }

  // Commandes & adresses de l'utilisateur
  let orders: any[] = [];
  let addresses: any[] = [];
  try {
    [orders, addresses] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: "desc" },
      }),
    ]);
  } catch (e) {
    // Silently continue
  }

  const isAdmin = user.role === Role.ADMIN || user.role === Role.STAFF;

  const statusBadges: Record<OrderStatus, { label: string; color: string; icon: any }> = {
    [OrderStatus.PENDING]: { label: "En attente", color: "text-amber-400 bg-amber-950/80 border-amber-800/60", icon: Clock },
    [OrderStatus.CONFIRMED]: { label: "Confirmée", color: "text-blue-400 bg-blue-950/80 border-blue-800/60", icon: CheckCircle2 },
    [OrderStatus.PROCESSING]: { label: "En préparation", color: "text-purple-400 bg-purple-950/80 border-purple-800/60", icon: Package },
    [OrderStatus.SHIPPED]: { label: "En cours de livraison", color: "text-cyan-400 bg-cyan-950/80 border-cyan-800/60", icon: Truck },
    [OrderStatus.DELIVERED]: { label: "Livrée", color: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60", icon: CheckCircle2 },
    [OrderStatus.CANCELLED]: { label: "Annulée", color: "text-rose-400 bg-rose-950/80 border-rose-800/60", icon: XCircle },
    [OrderStatus.RETURNED]: { label: "Retournée", color: "text-slate-400 bg-slate-900 border-slate-700", icon: XCircle },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── En-tête profil ── */}
      <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-600/30">
            {user.firstName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {user.firstName} {user.lastName}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Staff / Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            {user.phone && <p className="text-xs text-cyan-400 font-mono mt-0.5">{user.phone}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ChangePasswordModal />

          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Tableau de bord Admin</span>
            </Link>
          )}

          <form
            action={async () => {
              "use server";
              await logoutAction();
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Historique des commandes ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Mes Commandes ({orders.length})
            </h2>
            <Link
              href="/boutique"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Nouvelle commande
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-slate-800 space-y-3">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">Vous n&apos;avez pas encore passé de commande</p>
              <p className="text-xs text-slate-400">
                Vos commandes apparaîtront ici avec leur suivi en temps réel.
              </p>
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-md mt-2"
              >
                <span>Découvrir le catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const badge = statusBadges[ord.status as OrderStatus] || statusBadges[OrderStatus.PENDING];
                const Icon = badge.icon;
                return (
                  <div
                    key={ord.id}
                    className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono text-sm">
                          #{ord.number}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString("fr-MA", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Liste miniature */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {ord.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="truncate pr-4">
                            {item.quantity}× {item.productName}
                          </span>
                          <span className="font-semibold text-white shrink-0">
                            {formatPrice(item.lineTotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500">Ville de livraison : </span>
                        <strong className="text-white">{ord.shipCity || "Maroc"}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">Total TTC</span>
                        <span className="font-black text-cyan-400 text-base">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Coordonnées & Réassurance ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Carnet d&apos;adresses
            </h3>

            {addresses && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr: any) => (
                  <div
                    key={addr.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 text-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{addr.fullName}</strong>
                      {addr.isDefault && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40 font-semibold">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {addr.city} {addr.postalCode ? `(${addr.postalCode})` : ""}
                    </p>
                    <p className="text-cyan-400 font-mono pt-1">Tél : {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Aucune adresse enregistrée. Votre adresse sera automatiquement sauvegardée lors de votre prochaine commande.
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3 text-xs text-slate-400">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Engagement Hit Tech
            </h4>
            <p>
              Tous nos produits proviennent des circuits de distribution officiels marocains.
              En cas de question sur une commande en cours, contactez notre support à Casablanca.
            </p>
            <Link
              href="/contact"
              className="inline-block text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Contacter le support client →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
