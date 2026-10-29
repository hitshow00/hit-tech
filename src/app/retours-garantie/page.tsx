import Link from "next/link";
import { ShieldCheck, RotateCcw, Clock, Wrench, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Garanties & Politique de Retours | Hit Tech Maroc",
  description:
    "Modalités de retour sous 7 jours et garanties constructeur officielles de 12 à 24 mois sur les produits Hit Tech au Maroc.",
};

export default function RetoursGarantiePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-200 font-medium">Garanties & Retours</span>
      </nav>

      {/* En-tête */}
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sécurité d&apos;achat & Sérénité totale</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Politique de Garantie & Retours au Maroc
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Chez Hit Tech, tous nos appareils sont couverts par la garantie constructeur officielle et notre engagement de retour sous 7 jours ouvrés.
        </p>
      </div>

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/40 text-cyan-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">7 Jours pour changer d&apos;avis</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Droit de rétractation légal sous 7 jours ouvrables pour tout produit non descellé dans son emballage d&apos;origine.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">Garantie 12 à 24 Mois</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Prise en charge officielle par les centres SAV agréés des marques (Apple, Samsung, Asus, Lenovo, Sony) au Maroc.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800/40 text-amber-400 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-sm">SAV Dédié à Casablanca</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Dépôt direct ou assistance logistique express pour le transfert de votre matériel vers le centre technique agréé.
          </p>
        </div>
      </div>

      {/* Procédure pas à pas */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-5">
        <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
          Procédure pour effectuer un retour (Délai de rétractation)
        </h2>
        <ol className="space-y-4 text-xs sm:text-sm text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Contactez notre support client sous 7 jours :</strong> Transmettez votre numéro de commande (ex. <em>HT-2026-XXXX</em>) par email ou WhatsApp afin de recevoir votre bon d&apos;autorisation de retour.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">Préparez le colis scellé :</strong> Replacez l&apos;appareil dans sa boîte d&apos;origine non endommagée, avec tous les accessoires, câbles, manuels et étiquettes code-barres intactes.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Contrôle technique & Remboursement :</strong> Dès réception dans notre centre de tri à Casablanca et vérification de la conformité du produit, le remboursement ou l&apos;échange est opéré sous 48h à 72h ouvrées.
            </div>
          </li>
        </ol>
      </div>

      {/* Conditions d'exclusion */}
      <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Cas non couverts par le droit de retour ou la garantie :</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Produit dont le scellé d&apos;origine du fabricant a été rompu, activé ou lié à un compte personnel (iCloud, compte Google, etc.).</li>
          <li>Dommages causés par chute, choc physique, traces d&apos;oxydation, contact avec un liquide ou surtension électrique.</li>
          <li>Appareil ayant fait l&apos;objet d&apos;une tentative de réparation ou de modification par un réparateur non certifié.</li>
        </ul>
      </div>

      {/* Navigation basse */}
      <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/livraison"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Consulter nos modalités et zones de livraison
        </Link>
        <Link
          href="/contact"
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Ouvrir un dossier de retour auprès du support &rarr;
        </Link>
      </div>
    </div>
  );
}

