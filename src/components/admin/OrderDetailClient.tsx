"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  AlertCircle,
  Save,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { updateOrderStatusAction, updateOrderTrackingAction } from "@/actions/admin";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

interface OrderDetailClientProps {
  order: any;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [statusNote, setStatusNote] = useState("");
  const [carrier, setCarrier] = useState(order.carrier || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingMessage, setTrackingMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = () => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(order.id, status, statusNote);
      if (res.success) {
        setStatusNote("");
      }
    });
  };

  const handleTrackingUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateOrderTrackingAction(order.id, trackingNumber, carrier);
      if (res.success) {
        setTrackingMessage("Numéro de suivi enregistré !");
        setTimeout(() => setTrackingMessage(""), 3000);
      }
    });
  };

  // WhatsApp Morocco format
  let cleanPhone = order.shipPhone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "212" + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith("+212")) {
    cleanPhone = cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith("212")) {
    cleanPhone = "212" + cleanPhone;
  }

  const whatsAppMessage = `Bonjour ${order.shipFullName},\n\nHit Tech vous contacte pour votre commande *#${order.number}*.\nTotal : *${formatPrice(order.total)}* (${order.paymentMethod === "COD" ? "Paiement à la livraison" : "Payée par carte"}).\nAdresse de livraison : ${order.shipLine1}, ${order.shipCity}.\n\nStatut actuel : ${order.status}.\nN'hésitez pas à nous confirmer la réception de ce message. Merci !`;
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="space-y-8">
      {/* ── Barre d'action supérieure ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/commandes"
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Détail de la commande
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Commande #{order.number}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Bouton WhatsApp */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contacter client WhatsApp</span>
          </a>

          {/* Bouton Imprimer Bon de Livraison */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span>Imprimer bon / facture</span>
          </button>
        </div>
      </div>

      {/* ── Version Impression Header (Uniquement à l'impression) ── */}
      <div className="hidden print:block border-b pb-4 mb-4">
        <h1 className="text-xl font-bold">HIT TECH — BON DE LIVRAISON</h1>
        <p className="text-xs text-gray-600">Commande #{order.number} • Date: {new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
        <p className="text-xs text-gray-600">Mode de paiement: {order.paymentMethod === "COD" ? "Espèces à la livraison (COD)" : "Payé par Carte"}</p>
      </div>

      {/* ── Grille de Détails ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Principale (Articles & Récapitulatif) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles de la Commande */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Articles commandés ({order.items.length})</span>
            </h2>

            <div className="divide-y divide-zinc-900">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 text-zinc-600">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">{item.productName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        SKU: {item.sku} • Qté: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total / Sous-total */}
            <div className="pt-4 border-t border-zinc-900 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Remise promo ({order.discountCode || "Code"})</span>
                  <span>-{formatPrice(order.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Frais de livraison ({order.shipCity})</span>
                <span>
                  {order.shippingFee === 0 ? "Gratuit" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-900">
                <span>Total à encaisser</span>
                <span className="text-cyan-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Suivi Transporteur & Expédition */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl print:hidden">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Expédition & Transporteur</span>
            </h2>

            <form onSubmit={handleTrackingUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Société de transport
                </label>
                <input
                  type="text"
                  placeholder="ex: Amana Express, Cathedis, Livreur propre..."
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Numéro de suivi (Tracking)
                </label>
                <input
                  type="text"
                  placeholder="ex: MA-9823472"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-medium">
                  {trackingMessage}
                </span>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer le suivi</span>
                </button>
              </div>
            </form>
          </div>

          {/* Historique chronologique des statuts */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl print:hidden">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Historique de la commande</span>
            </h2>

            <div className="space-y-3">
              {order.history && order.history.length > 0 ? (
                order.history.map((h: any) => (
                  <div key={h.id} className="flex items-start gap-3 text-xs border-l-2 border-zinc-800 pl-3 py-1">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">
                        Statut : <span className="text-cyan-400">{h.status}</span>
                      </p>
                      {h.note && <p className="text-zinc-400">{h.note}</p>}
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {new Date(h.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">Aucun historique disponible.</p>
              )}
            </div>
          </div>
        </div>

        {/* Colonne Latérale (Statut & Coordonnées Client) */}
        <div className="space-y-6">
          {/* Mise à jour du Statut */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl print:hidden">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modifier le Statut</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Statut actuel
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white outline-none focus:border-cyan-500"
                >
                  <option value="PENDING">En attente</option>
                  <option value="CONFIRMED">Confirmée</option>
                  <option value="PROCESSING">En préparation</option>
                  <option value="SHIPPED">Expédiée (En livraison)</option>
                  <option value="DELIVERED">Livrée (Encaissée)</option>
                  <option value="CANCELLED">Annulée</option>
                  <option value="RETURNED">Retournée / Remboursée</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Note interne (optionnelle)
                </label>
                <input
                  type="text"
                  placeholder="ex: Client confirmé par téléphone, départ 14h..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isPending}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-bold transition-opacity cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {isPending ? "Mise à jour..." : "Appliquer le statut"}
              </button>
            </div>
          </div>

          {/* Fiche Client & Livraison */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Coordonnées Client</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Nom complet</span>
                <p className="font-bold text-white text-sm mt-0.5">{order.shipFullName}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Téléphone</span>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">{order.shipPhone}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Email</span>
                <p className="text-zinc-300 mt-0.5">{order.email}</p>
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 block">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>Adresse de livraison</span>
                </span>
                <p className="text-white mt-1 font-medium">{order.shipLine1}</p>
                {order.shipLine2 && <p className="text-zinc-400 text-[11px]">{order.shipLine2}</p>}
                <p className="text-zinc-300 font-bold mt-1">{order.shipCity}, Maroc</p>
              </div>

              {order.customerNote && (
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px]">
                  <span className="font-bold text-amber-400 block mb-0.5">Note du client :</span>
                  <p className="text-zinc-300 italic">{order.customerNote}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mode de règlement */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-6 space-y-3 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Règlement</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Moyen de paiement</span>
                <span className="font-bold text-white">
                  {order.paymentMethod === "COD" ? "Cash à la livraison" : "Carte Bancaire"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">État du paiement</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {order.paymentStatus === "PAID" ? "Payé" : "En attente d'encaissement"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
