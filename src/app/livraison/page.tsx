import Link from "next/link";
import { getShippingCities } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Package,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Livraison & Villes Desservies au Maroc | Hit Tech",
  description:
    "Découvrez les délais et tarifs de livraison de Hit Tech partout au Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir. Livraison gratuite dès 500 DH.",
};

export default async function LivraisonPage() {
  const cities = await getShippingCities();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">Livraison au Maroc</span>
      </nav>

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Politique & Délais de Livraison au Maroc
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Nous expédions vos produits high-tech neufs scellés directement depuis notre hub de Casablanca vers toutes les villes du Royaume.
        </p>
      </div>

      {/* Cartes d'engagements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Livraison Gratuite dès 500 DH</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pour toute commande d&apos;un montant supérieur ou égal à 500 DH, la livraison est 100% offerte à domicile.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Paiement à la Réception (COD)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ne payez qu&apos;une fois le colis entre vos mains. Vous pouvez vérifier l&apos;état extérieur et l&apos;intégrité de l&apos;emballage scellé devant le livreur.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Emballage Blindé & Scellé</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chaque smartphone, PC portable ou tablette est emballé dans un carton antichoc renforcé avec scellé d&apos;inviolabilité Hit Tech.
          </p>
        </div>
      </div>

      {/* Tableau des villes */}
      <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Tarifs et Délais par Ville
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Les délais sont calculés en jours ouvrés à compter de la validation de la commande.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ville / Zone</th>
                <th className="py-3 px-4">Délai indicatif</th>
                <th className="py-3 px-4">Tarif standard</th>
                <th className="py-3 px-4">Paiement à la livraison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {city.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300">
                    {city.minDays === city.maxDays
                      ? `${city.minDays} jour (24h)`
                      : `${city.minDays} à ${city.maxDays} jours (${city.minDays * 24}h-${city.maxDays * 24}h)`}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white">{formatPrice(city.fee)}</span>
                    <span className="text-[10px] text-emerald-400 block">
                      (Gratuit dès 500 DH)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Disponible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
