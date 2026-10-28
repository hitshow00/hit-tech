"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  MessageCircle,
  MoreVertical,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { updateOrderStatusAction, bulkUpdateOrderStatusAction } from "@/actions/admin";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderRow {
  id: string;
  number: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  shipFullName: string;
  shipPhone: string;
  shipCity: string;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: Date | string;
  items: OrderItem[];
}

interface OrdersTableClientProps {
  orders: OrderRow[];
}

export function OrdersTableClient({ orders }: OrdersTableClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const statusColors: Record<OrderStatus, { bg: string; text: string; border: string; label: string }> = {
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "En attente" },
    CONFIRMED: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Confirmée" },
    PROCESSING: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", label: "En préparation" },
    SHIPPED: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", label: "Expédiée" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Livrée" },
    CANCELLED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", label: "Annulée" },
    RETURNED: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", label: "Retournée" },
  };

  // Filtrage
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.number.toLowerCase().includes(q) ||
      order.shipFullName.toLowerCase().includes(q) ||
      order.shipPhone.includes(q) ||
      order.shipCity.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Gestion sélection groupée
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
    });
  };

  const handleBulkStatus = (status: OrderStatus) => {
    if (!selectedIds.length) return;
    startTransition(async () => {
      await bulkUpdateOrderStatusAction(selectedIds, status);
      setSelectedIds([]);
    });
  };

  // Préparation lien WhatsApp Maroc
  const getWhatsAppLink = (order: OrderRow) => {
    let cleanPhone = order.shipPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "212" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("+212")) {
      cleanPhone = cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("212")) {
      cleanPhone = "212" + cleanPhone;
    }

    const message = `Bonjour ${order.shipFullName},\n\nL'équipe Hit Tech vous contacte pour confirmer votre commande *#${order.number}* d'un montant de *${formatPrice(order.total)}* (${order.paymentMethod === "COD" ? "Paiement en espèces à la livraison" : "Payée en ligne"}).\n\nConfirmez-vous votre adresse de livraison à *${order.shipCity}* ?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const tabs = [
    { key: "ALL", label: "Toutes", count: orders.length },
    { key: "PENDING", label: "En attente", count: orders.filter((o) => o.status === "PENDING").length },
    { key: "CONFIRMED", label: "Confirmées", count: orders.filter((o) => o.status === "CONFIRMED").length },
    { key: "PROCESSING", label: "En préparation", count: orders.filter((o) => o.status === "PROCESSING").length },
    { key: "SHIPPED", label: "Expédiées", count: orders.filter((o) => o.status === "SHIPPED").length },
    { key: "DELIVERED", label: "Livrées", count: orders.filter((o) => o.status === "DELIVERED").length },
    { key: "CANCELLED", label: "Annulées", count: orders.filter((o) => o.status === "CANCELLED").length },
  ];

  return (
    <div className="space-y-6">
      {/* ── Onglets de Statut ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-900 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusFilter(tab.key);
              setSelectedIds([]);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === tab.key
                ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.key
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-900 text-zinc-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Barre de Contrôle : Recherche & Actions Groupées ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Recherche */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par n° commande, client, téléphone, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 focus:border-cyan-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        {/* Actions Groupées (si commandes sélectionnées) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-xl animate-in fade-in">
            <span className="text-xs font-bold text-cyan-400 px-2">
              {selectedIds.length} sélectionnée(s)
            </span>
            <button
              onClick={() => handleBulkStatus(OrderStatus.CONFIRMED)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors"
            >
              Confirmer
            </button>
            <button
              onClick={() => handleBulkStatus(OrderStatus.SHIPPED)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
            >
              Expédier
            </button>
            <button
              onClick={() => handleBulkStatus(OrderStatus.DELIVERED)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
            >
              Livrée
            </button>
          </div>
        )}
      </div>

      {/* ── Tableau des Commandes ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Paiement</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500 text-xs">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  const st = statusColors[order.status] || statusColors.PENDING;

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-zinc-900/40 transition-colors ${
                        isSelected ? "bg-cyan-950/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSelect(order.id)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Numéro de Commande */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>#{order.number}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </Link>
                        <span className="text-[10px] text-zinc-500">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} article(s)
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Client */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{order.shipFullName}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{order.shipPhone}</p>
                      </td>

                      {/* Destination */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
                          {order.shipCity}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">
                          {formatPrice(order.total)}
                        </span>
                        {order.shippingFee === 0 && (
                          <span className="block text-[9px] text-emerald-400 font-medium">
                            Livraison gratuite
                          </span>
                        )}
                      </td>

                      {/* Paiement */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            {order.paymentMethod === "COD" ? "Cash à la livraison" : "Carte (Stripe)"}
                          </span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              order.paymentStatus === "PAID"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {order.paymentStatus === "PAID" ? "Payée" : "En attente"}
                          </span>
                        </div>
                      </td>

                      {/* Statut sélecteur rapide */}
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border outline-none bg-zinc-950 cursor-pointer transition-colors ${st.text} ${st.border}`}
                        >
                          <option value="PENDING">En attente</option>
                          <option value="CONFIRMED">Confirmée</option>
                          <option value="PROCESSING">En préparation</option>
                          <option value="SHIPPED">Expédiée</option>
                          <option value="DELIVERED">Livrée</option>
                          <option value="CANCELLED">Annulée</option>
                          <option value="RETURNED">Retournée</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Bouton WhatsApp Maroc */}
                          <a
                            href={getWhatsAppLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Confirmer par WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Voir détail */}
                          <Link
                            href={`/admin/commandes/${order.id}`}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                            title="Voir le détail et imprimer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
