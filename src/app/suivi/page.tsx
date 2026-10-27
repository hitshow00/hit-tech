import Link from "next/link";
import { prisma, OrderStatus } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

interface SuiviPageProps {
  searchParams: Promise<{ n?: string }>;
}

export default async function SuiviPage({ searchParams }: SuiviPageProps) {
  const { n } = await searchParams;
  const orderNumber = n?.trim().toUpperCase();

  let order: any = null;
  if (orderNumber) {
    try {
      order = await prisma.order.findUnique({
        where: { number: orderNumber },
        include: { items: true },
      });
    } catch {}
  }

  const steps = [
    { key: OrderStatus.PENDING, label: "Commande reçue", desc: "Enregistrée dans le système" },
    { key: OrderStatus.CONFIRMED, label: "Confirmée", desc: "Validée" },
    { key: OrderStatus.PROCESSING, label: "Préparation", desc: "Emballage et contrôle" },
    { key: OrderStatus.SHIPPED, label: "En cours d'acheminement", desc: "Remise au transporteur" },
    { key: OrderStatus.DELIVERED, label: "Livrée", desc: "Colis réceptionné" },
  ];

  const currentStepIndex = order
    ? steps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-zinc-300">Suivi de commande</span>
      </nav>

      <div className="text-center space-y-2 mb-10">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center mx-auto mb-4">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Suivi de votre Commande
        </h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Entrez votre numéro de référence pour consulter l&apos;état d&apos;acheminement de votre colis.
        </p>
      </div>

      {/* Formulaire de recherche */}
      <div className="rounded-xl bg-zinc-950 p-6 border border-zinc-900 max-w-lg mx-auto mb-10">
        <form action="/suivi" method="GET" className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              name="n"
              defaultValue={orderNumber || ""}
              required
              placeholder="Ex : HT-20261025-XXXX"
              className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 uppercase font-mono"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shrink-0"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Résultat */}
      {orderNumber && (
        <>
          {order ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Référence
                    </span>
                    <h2 className="text-lg font-black text-white font-mono">{order.number}</h2>
                    <span className="text-xs text-zinc-500">
                      Date : {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-zinc-400 block">Total réglé</span>
                    <span className="text-lg font-black text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Stepper horizontal monochrome */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                            isCurrent
                              ? "bg-zinc-900 border-white text-white"
                              : isCompleted
                              ? "bg-black border-zinc-700 text-zinc-200"
                              : "bg-black border-zinc-900 text-zinc-600"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px]">0{idx + 1}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-zinc-700" />
                            )}
                          </div>
                          <div>
                            <strong className="block text-xs">{step.label}</strong>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">{step.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Articles */}
                <div className="pt-4 border-t border-zinc-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Articles de la commande
                  </h3>
                  <div className="divide-y divide-zinc-900 text-xs">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="text-zinc-500 block text-[11px]">Quantité : {item.quantity}</span>
                        </div>
                        <span className="font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-zinc-950 p-8 border border-zinc-900 text-center space-y-2">
              <h3 className="font-bold text-white text-base">Aucune commande trouvée</h3>
              <p className="text-xs text-zinc-500">
                Le numéro &quot;{orderNumber}&quot; ne correspond à aucun enregistrement actif.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
