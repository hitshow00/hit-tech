import Link from "next/link";
import { FileText, ShieldCheck, ChevronRight, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Conditions Générales de Vente (CGV) | Hit Tech Maroc",
  description:
    "Conditions Générales de Vente applicables aux commandes de produits high-tech sur Hit Tech (Maroc). Conformité Loi 31-08 sur la protection du consommateur.",
};

export default function CGVPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-zinc-200 font-medium">Conditions Générales de Vente</span>
      </nav>

      {/* En-tête */}
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cadre contractuel officiel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Conditions Générales de Vente (CGV)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Dernière mise à jour : Octobre 2026. Applicables aux commandes passées sur la plateforme Hit Tech au Royaume du Maroc.
        </p>
      </div>

      {/* Note d'information pour le client / exploitant */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Informations légales de l&apos;éditeur
        </p>
        <p className="text-zinc-400 leading-relaxed">
          Le présent site e-commerce est exploité par la société <strong>Hit Tech SARL</strong> (en cours d&apos;immatriculation / RC : [À compléter par le client] - ICE : [À compléter par le client]), dont le siège social est situé à Casablanca, Maroc. Email : <a href="mailto:contact@hittech.ma" className="text-cyan-400 hover:underline">contact@hittech.ma</a>.
        </p>
      </div>

      {/* Corps des CGV */}
      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            1. Objet et champ d&apos;application
          </h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la boutique en ligne Hit Tech et toute personne physique ou morale (ci-après « le Client ») effectuant un achat sur le site <strong>hit-tech.vercel.app</strong> ou son domaine associé.
          </p>
          <p>
            Toute validation de commande implique l&apos;acceptation pleine, entière et sans réserve des présentes conditions, conformément aux dispositions de la <strong>Loi n° 31-08</strong> édictant des mesures de protection du consommateur au Maroc.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            2. Produits et authenticité
          </h2>
          <p>
            Hit Tech commercialise exclusivement des produits électroniques grand public (smartphones, ordinateurs portables, tablettes, accessoires audio) <strong>100% neufs, authentiques et sous emballage d&apos;origine scellé</strong> par le fabricant.
          </p>
          <p>
            Les fiches descriptives, caractéristiques techniques et visuels sont présentés avec la plus grande rigueur. En cas de questions complémentaires sur les spécifications d&apos;un produit, le service client est disponible avant validation de la commande.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            3. Prix et devise
          </h2>
          <p>
            Les prix des produits sont indiqués en <strong>Dirhams Marocains (MAD) toutes taxes comprises (TTC)</strong>. Ils ne comprennent pas les éventuels frais de livraison, lesquels sont clairement détaillés avant la validation finale de la commande (livraison offerte dès 500 DH d&apos;achats).
          </p>
          <p>
            Hit Tech se réserve le droit de modifier ses prix à tout moment. Toutefois, les produits seront facturés sur la base des tarifs en vigueur au moment de l&apos;enregistrement de la commande.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            4. Modalités de règlement
          </h2>
          <p>
            Afin de garantir un niveau de sécurité et de sérénité maximal pour nos clients au Maroc, le mode de règlement principal proposé est :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>
              <strong>Paiement à la livraison (Cash on Delivery - COD) :</strong> Le règlement s&apos;effectue en espèces directement auprès du transporteur lors de la remise en main propre du colis.
            </li>
            <li>
              <strong>Virement bancaire ou paiement par carte (sur demande / en cours de déploiement) :</strong> Soumis à validation préalable par notre service commercial.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            5. Expédition et livraison
          </h2>
          <p>
            Les livraisons sont assurées sur l&apos;ensemble du territoire marocain (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, etc.) via des prestataires de messagerie express reconnus (Amana Express, etc.).
          </p>
          <p>
            Les délais indicatifs d&apos;acheminement sont de <strong>24h à 48h ouvrées</strong> pour l&apos;axe Casablanca-Rabat, et de <strong>48h à 72h ouvrées</strong> pour les autres villes du Royaume. Le Client s&apos;engage à vérifier l&apos;état extérieur du colis et l&apos;intégrité des scellés avant de procéder au règlement auprès du livreur.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            6. Droit de rétractation et retours
          </h2>
          <p>
            Conformément à l&apos;article 36 de la Loi n° 31-08, le consommateur dispose d&apos;un délai légal de <strong>7 (sept) jours ouvrables</strong> à compter de la réception de sa commande pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p>
            <strong>Conditions strictes de reprise :</strong> Les appareils high-tech doivent être retournés dans leur état d&apos;origine, avec tous leurs accessoires, notices et emballages scellés intacts. Tout produit descellé, activé, configuré ou présentant des traces d&apos;utilisation ne pourra faire l&apos;objet d&apos;un remboursement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            7. Garanties et service après-vente (SAV)
          </h2>
          <p>
            Tous les appareils neufs bénéficient de la <strong>garantie constructeur officielle</strong> (durée de 12 à 24 mois selon les marques : Apple, Samsung, Lenovo, Asus, etc.) contre tout défaut de fabrication.
          </p>
          <p>
            La garantie ne couvre pas les dommages résultant d&apos;accidents, chutes, immersion liquide, ouverture par un tiers non agréé ou modifications logicielles non conformes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
            8. Droit applicable et litiges
          </h2>
          <p>
            Les présentes CGV sont régies par le droit marocain. En cas de différend relatif à l&apos;interprétation ou à l&apos;exécution d&apos;une commande, les parties privilégieront une résolution amiable. À défaut, les tribunaux de commerce de Casablanca seront seuls compétents.
          </p>
        </section>
      </div>

      {/* Footer de contact */}
      <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Une question sur nos conditions de vente ? Contactez notre support</span>
        </Link>
        <Link
          href="/retours-garantie"
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          Voir les modalités de retour et garantie &rarr;
        </Link>
      </div>
    </div>
  );
}
