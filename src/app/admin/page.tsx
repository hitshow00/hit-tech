import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role, OrderStatus, PaymentStatus } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "Administration | Hit Tech",
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

  try {
    [orders, products, usersCount] = await Promise.all([
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true, user: true },
      }),
      prisma.product.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { category: true, brand: true },
      }),
      prisma.user.count(),
    ]);

    const revenueResult = await prisma.order.aggregate({
      where: {
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: { total: true },
    });
    totalRevenue = revenueResult._sum.total || 0;

    pendingOrdersCount = await prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });
  } catch (e) {
    // Silently continue
  }

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ── En-tête Admin ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Console d&apos;Administration
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Tableau de Bord
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Session active : <strong className="text-white">{user.firstName} {user.lastName}</strong> ({user.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ChangePasswordModal />

          <Link
            href="/boutique"
            className="px-4 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-white border border-zinc-800 transition-colors flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Voir la boutique</span>
          </Link>
        </div>
      </div>

      {/* ── KPIs Statistiques Monochrome ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-zinc-950 p-5 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Chiffre d&apos;Affaires
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {formatPrice(totalRevenue)}
          </span>
          <span className="text-[11px] text-zinc-500">Commandes finalisées</span>
        </div>

        <div className="rounded-xl bg-zinc-950 p-5 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Commandes en cours
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {pendingOrdersCount}
          </span>
          <span className="text-[11px] text-zinc-500">À préparer</span>
        </div>

        <div className="rounded-xl bg-zinc-950 p-5 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Articles actifs
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {products.length}
          </span>
          <span className="text-[11px] text-zinc-500">Références en catalogue</span>
        </div>

        <div className="rounded-xl bg-zinc-950 p-5 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Stock restreint
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {lowStockProducts.length}
          </span>
          <span className="text-[11px] text-zinc-500">Stock ≤ 5 unités</span>
        </div>
      </div>

      {/* ── Dernières Commandes ── */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              Dernières Commandes
            </h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">
            Aucune commande enregistrée pour l&apos;instant.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Réf</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Ville</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3">Règlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3 px-3 text-zinc-500">
                      {new Date(ord.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {ord.shippingFullName}
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {ord.shippingPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {ord.shipCity || "—"}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-zinc-400">
                        {ord.paymentMethod === "COD" ? "Livraison" : "Carte"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Gestion des Produits ── */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-zinc-400" />
            Catalogue & Disponibilités
          </h2>
          <Link
            href="/admin/produits"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            Gérer tout le catalogue ({products.length}) →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">
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
                        className="hover:text-zinc-300 transition-colors"
                      >
                        {prod.name}
                      </Link>
                      <span className="block text-[10px] text-zinc-500 font-mono">
                        {prod.sku}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {prod.category?.name || "—"}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {prod.brand?.name || "—"}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-zinc-300 font-medium">
                        {prod.stock} unités
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {prod.status}
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
