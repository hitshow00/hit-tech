import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role, OrderStatus, PaymentStatus } from "@/lib/prisma";
import { OrdersTableClient } from "@/components/admin/OrdersTableClient";
import { formatPrice } from "@/lib/currency";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Gestion des Commandes | Hit Tech Admin",
};

export default async function AdminOrdersPage() {
  const { user } = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin/commandes");
  }

  // Récupération de toutes les commandes avec items
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          id: true,
          productName: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  });

  const pendingCount = orders.filter((o) => o.status === OrderStatus.PENDING).length;
  const processingCount = orders.filter((o) => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.CONFIRMED).length;
  const shippedCount = orders.filter((o) => o.status === OrderStatus.SHIPPED).length;
  const deliveredCount = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === PaymentStatus.PAID)
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Logistique & Expéditions
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Gestion des Commandes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Suivi des ventes, confirmations WhatsApp et expéditions partout au Maroc.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>{pendingCount} commande(s) en attente de confirmation</span>
          </div>
        )}
      </div>

      {/* ── KPIs Commandes ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              En attente
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{pendingCount}</p>
          <span className="text-[10px] text-zinc-500">À valider avec le client</span>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              En préparation
            </span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{processingCount}</p>
          <span className="text-[10px] text-zinc-500">Emballage et stock</span>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              En livraison
            </span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{shippedCount}</p>
          <span className="text-[10px] text-zinc-500">Colis chez le livreur</span>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Chiffre Encaissé
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[10px] text-zinc-500">{deliveredCount} livrée(s) avec succès</span>
        </div>
      </div>

      {/* ── Tableau Interactif Client ── */}
      <OrdersTableClient orders={orders} />
    </div>
  );
}
