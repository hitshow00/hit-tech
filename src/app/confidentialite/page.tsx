import Link from "next/link";
import { Lock, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Politique de Confidentialité & Données Personnelles | Hit Tech Maroc",
  description:
    "Protection de vos données personnelles et respect de votre vie privée sur Hit Tech. Traitement conforme à la Loi n° 09-08 (CNDP Maroc).",
};

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-200 font-medium">Politique de Confidentialité</span>
      </nav>

      {/* En-tête */}
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protection des données personnelles (Loi 09-08)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Politique de Confidentialité & Respect de la Vie Privée
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Votre confiance est primordiale. Découvrez comment Hit Tech collecte, utilise et protège vos informations personnelles.
        </p>
      </div>

      {/* Engagements clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
          <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zéro Revente</span>
          </div>
          <p className="text-xs text-zinc-400">
            Vos données ne sont ni vendues, ni louées, ni cédées à des courtiers en données tiers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
          <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Hachage Robuste</span>
          </div>
          <p className="text-xs text-zinc-400">
            Mots de passe protégés par l&apos;algorithme moderne Argon2id et sessions chiffrées en SHA-256.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2">
          <div className="text-white font-bold text-xs flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Conformité CNDP</span>
          </div>
          <p className="text-xs text-zinc-400">
            Traitements déclarés conformément aux dispositions de la Commission Nationale de Contrôle (Loi 09-08).
          </p>
        </div>
      </div>

      {/* Corps */}
      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles collectées sur le site est la société <strong>Hit Tech</strong>, établie à Casablanca, Maroc. Email dédié à la protection des données : <a href="mailto:privacy@hittech.ma" className="text-cyan-400 hover:underline">privacy@hittech.ma</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            2. Données collectées et finalités
          </h2>
          <p>
            Nous ne collectons que les informations strictement nécessaires à la bonne exécution de nos prestations :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>
              <strong>Gestion des commandes & livraison :</strong> Nom, prénom, numéro de téléphone portable, adresse de livraison précise et ville au Maroc, pour permettre l&apos;acheminement et la remise de vos colis par nos livreurs.
            </li>
            <li>
              <strong>Compte client & sécurité :</strong> Adresse email et mot de passe chiffré, pour vous permettre de consulter votre historique d&apos;achat et le statut de vos commandes.
            </li>
            <li>
              <strong>Service client & SAV :</strong> Messages transmis via le formulaire de contact ou WhatsApp pour le suivi des requêtes d&apos;assistance.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            3. Destinataires des données
          </h2>
          <p>
            Vos données personnelles sont exclusivement destinées aux collaborateurs habilités de Hit Tech et à nos prestataires logistiques de confiance (sociétés de messagerie express au Maroc) pour la seule finalité de la livraison de votre colis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            4. Durée de conservation
          </h2>
          <p>
            Les données relatives aux commandes et factures sont conservées pendant la durée légale requise par le code de commerce marocain (10 ans). Les comptes clients inactifs depuis plus de 3 ans font l&apos;objet d&apos;une purge ou anonymisation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            5. Vos droits (Accès, Rectification, Suppression)
          </h2>
          <p>
            Conformément à la Loi n° 09-08, vous disposez à tout moment d&apos;un droit d&apos;accès, de rectification et d&apos;opposition au traitement de vos données personnelles. Vous pouvez exercer ce droit directement depuis votre espace client ou en écrivant à <a href="mailto:contact@hittech.ma" className="text-cyan-400 hover:underline">contact@hittech.ma</a> avec une copie de votre pièce d&apos;identité.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            6. Cookies et traceurs
          </h2>
          <p>
            Le site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du panier d&apos;achat et au maintien de votre session sécurisée. Aucun cookie publicitaire intrusif n&apos;est déposé sans votre consentement exprès.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/conditions-generales-de-vente"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Consulter nos Conditions Générales de Vente
        </Link>
        <Link
          href="/contact"
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Contacter notre délégué à la protection des données &rarr;
        </Link>
      </div>
    </div>
  );
}

