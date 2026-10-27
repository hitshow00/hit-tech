import Link from "next/link";
import { prisma, PaymentMethod } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;

  let order: any = null;
  try {
    order = await prisma.order.findUnique({
      where: { number: orderNumber },
      include: {
        items: true,
      },
    });
  } catch (e) {
    // Silently continue
  }

  const defaultPhone = "212661234567";
  const whatsappMsg = encodeURIComponent(
    `Salam ! Je vous contacte au sujet de ma commande Hit Tech N° ${orderNumber}.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* ── En-tête de confirmation ── */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Commande Confirmée avec Succès
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Merci pour votre confiance !
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Votre commande <strong className="text-white">#{orderNumber}</strong> est bien enregistrée.
            Notre équipe prépare votre colis dans notre entrepôt à Casablanca.
          </p>
        </div>
      </div>

      {/* ── Cartouche de récapitulatif ── */}
      <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-8">
        {/* Statut & Délais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block">Référence</span>
              <strong className="text-white font-mono text-sm">{orderNumber}</strong>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block">Livraison estimée</span>
              <strong className="text-white">
                {order?.shipCity === "Casablanca"
                  ? "Sous 24h ouvrées"
                  : order?.shipCity === "Rabat"
                  ? "24h à 48h ouvrées"
                  : "48h à 72h ouvrées"}
              </strong>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 block">Paiement</span>
              <strong className="text-white">
                {order?.paymentMethod === PaymentMethod.COD
                  ? "En espèces au livreur"
                  : "Carte bancaire (Payé)"}
              </strong>
            </div>
          </div>
        </div>

        {/* Détails de livraison */}
        {order && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Adresse de Réception
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1 text-slate-300">
              <p className="font-bold text-white text-sm">{order.shipFullName}</p>
              <p>{order.shipLine1}</p>
              {order.shipLine2 && <p>{order.shipLine2}</p>}
              <p>
                {order.shipCity} {order.shipPostalCode ? `• ${order.shipPostalCode}` : ""} • Maroc
              </p>
              <p className="text-cyan-400 pt-1 font-mono">Tél : {order.shipPhone}</p>
            </div>
          </div>
        )}

        {/* Articles commandés */}
        {order?.items && order.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              Articles Commandés
            </h3>
            <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{item.productName}</span>
                    <span className="text-[11px] text-slate-500">
                      Qté : {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-white">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-baseline justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                Total TTC de la commande
              </span>
              <span className="text-2xl font-black text-cyan-400">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        )}

        {/* Support WhatsApp direct avec N° commande */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">
                Besoin d&apos;ajuster votre livraison ?
              </h4>
              <p className="text-[11px] text-slate-400">
                Contactez notre équipe sur WhatsApp avec votre numéro de commande #{orderNumber}.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${defaultPhone}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 shadow-lg shadow-emerald-950 transition-all"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-xs shadow-lg shadow-cyan-600/20 hover:opacity-95 transition-all"
        >
          <span>Continuer mes achats</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
