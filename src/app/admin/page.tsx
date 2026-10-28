import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role, OrderStatus, PaymentStatus, ReviewStatus } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  Eye,
  Plus,
  Tag,
  Star,
  Users,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Tableau de Bord | Hit Tech Admin",
};

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin");
  }

  let orders: any[] = [];
  let products: any[] = [];
  let usersCount = 0;
  let totalRevenue = 0;
  let pendingOrdersCount = 0;
  let pendingReviewsCount = 0;
  let activeDiscountsCount = 0;

  try {
    const [ordersRes, productsRes, usersRes, revRes, pendingOrdRes, pendingRevRes, discountsRes] =
      await Promise.all([
        prisma.order.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        }),
        prisma.product.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { category: true, brand: true },
        }),
        prisma.user.count(),
        prisma.order.aggregate({
          where: { paymentStatus: PaymentStatus.PAID },
          _sum: { total: true },
        }),
        prisma.order.count({ where: { status: OrderStatus.PENDING } }),
        prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
        prisma.discountCode.count({ where: { isActive: true } }),
      ]);

    orders = ordersRes;
    products = productsRes;
    usersCount = usersRes;
    totalRevenue = revRes._sum.total || 0;
    pendingOrdersCount = pendingOrdRes;
    pendingReviewsCount = pendingRevRes;
    activeDiscountsCount = discountsRes;
  } catch (e) {
    // Silently continue
  }

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  return (
    <div className="space-y-8">
      {/* ── En-tête Admin ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Console d&apos;Administration
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Tableau de Bord
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Bienvenue, <strong className="text-white">{user.firstName} {user.lastName}</strong>.
            Vue d&apos;ensemble de la boutique Hit Tech Maroc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ChangePasswordModal />

          <Link
            href="/boutique"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-800 transition-colors flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Voir la boutique</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
        </div>
      </div>

      {/* ── Raccourcis d'actions rapides (Quick Actions) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/produits"
          className="p-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
              Catalogue & Stock
            </p>
            <p className="text-[10px] text-zinc-500">Ajouter / modifier</p>
          </div>
        </Link>

        <Link
          href="/admin/commandes"
          className="p-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
              Commandes
            </p>
            <p className="text-[10px] text-zinc-500">{pendingOrdersCount} à traiter</p>
          </div>
        </Link>

        <Link
          href="/admin/promotions"
          className="p-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Tag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors truncate">
              Codes Promo
            </p>
            <p className="text-[10px] text-zinc-500">{activeDiscountsCount} actifs</p>
          </div>
        </Link>

        <Link
          href="/admin/avis"
          className="p-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              Avis Clients
            </p>
            <p className="text-[10px] text-zinc-500">{pendingReviewsCount} en attente</p>
          </div>
        </Link>
      </div>

      {/* ── Alerte stock critique si existant ── */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                Alerte de Stock Faible ({lowStockProducts.length} référence(s))
              </p>
              <p className="text-[11px] text-zinc-400">
                Certains produits ont un stock inférieur ou égal à 5 unités.
              </p>
            </div>
          </div>
          <Link
            href="/admin/produits"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Réapprovisionner →
          </Link>
        </div>
      )}

      {/* ── KPIs Principaux ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA */}
        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-900 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Chiffre d&apos;Affaires Encaissé
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 block">
            {formatPrice(totalRevenue)}
          </span>
          <span className="text-[11px] text-zinc-500">Commandes payées</span>
        </div>

        {/* Commandes à traiter */}
        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-900 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Commandes à Confirmer
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-400 block">
            {pendingOrdersCount}
          </span>
          <span className="text-[11px] text-zinc-500">En attente de validation</span>
        </div>

        {/* Articles actifs */}
        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-900 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Produits au Catalogue
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {products.length}
          </span>
          <span className="text-[11px] text-zinc-500">Références actives</span>
        </div>

        {/* Clients */}
        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-900 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Comptes Enregistrés
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {usersCount}
          </span>
          <span className="text-[11px] text-zinc-500">Clients & administrateurs</span>
        </div>
      </div>

      {/* ── Dernières Commandes ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Dernières Commandes</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Les ventes les plus récentes enregistrées sur le site.
            </p>
          </div>
          <Link
            href="/admin/commandes"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1"
          >
            <span>Toutes les commandes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">
            Aucune commande enregistrée pour l&apos;instant.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">N° Commande</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Ville</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3">Règlement</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <Link
                        href={`/admin/commandes/${ord.id}`}
                        className="hover:text-cyan-400 transition-colors"
                      >
                        #{ord.number}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-zinc-400 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {ord.shipFullName}
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {ord.shipPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {ord.shipCity || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-zinc-400">
                        {ord.paymentMethod === "COD" ? "Cash livraison" : "Carte"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/commandes/${ord.id}`}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold transition-colors"
                      >
                        Détail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Aperçu du Catalogue ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Derniers Produits Ajoutés</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Gestion de votre inventaire et de la visibilité sur la boutique.
            </p>
          </div>
          <Link
            href="/admin/produits"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1"
          >
            <span>Gérer tout le catalogue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">
            Aucun produit dans la base.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Produit</th>
                  <th className="py-3 px-3">Catégorie</th>
                  <th className="py-3 px-3">Marque</th>
                  <th className="py-3 px-3">Prix</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-white">
                      <Link
                        href={`/produit/${prod.slug}`}
                        target="_blank"
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{prod.name}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-600" />
                      </Link>
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        SKU: {prod.sku}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {prod.category?.name || "—"}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {prod.brand?.name || "—"}
                    </td>
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          prod.stock <= 5 ? "text-amber-400" : "text-zinc-300"
                        }`}
                      >
                        {prod.stock} unités
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          prod.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}
                      >
                        {prod.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
