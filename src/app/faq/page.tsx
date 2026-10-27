import Link from "next/link";
import {
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Foire Aux Questions (FAQ) | Hit Tech Maroc",
  description:
    "Toutes les réponses à vos questions concernant la garantie officielle, le paiement à la livraison, les délais et les produits chez Hit Tech Maroc.",
};

export default function FaqPage() {
  const faqs = [
    {
      q: "Les produits vendus sur Hit Tech sont-ils 100% neufs et officiels ?",
      a: "Absolument. Tous les smartphones, PC portables, tablettes et casques audio proposés sur Hit Tech sont 100% neufs, scellés sous blister d'origine constructeur. Nous ne vendons aucun produit d'occasion ni reconditionné.",
    },
    {
      q: "Comment se déroule le paiement en espèces à la livraison (COD) ?",
      a: "Vous commandez en toute liberté sur notre site sans renseigner de numéro de carte bancaire. Dès que votre colis arrive à votre adresse à Casablanca, Rabat, Marrakech ou toute autre ville, le livreur vous le remet et vous réglez le montant exact en espèces en dirhams (MAD).",
    },
    {
      q: "Puis-je inspecter mon colis devant le livreur avant de payer ?",
      a: "Oui, tout à fait ! Nous encourageons nos clients à vérifier l'intégrité de l'emballage extérieur et des scellés de sécurité Hit Tech avant de procéder au règlement.",
    },
    {
      q: "Quelle est la durée et la couverture de la garantie constructeur ?",
      a: "Tous nos équipements bénéficient d'une garantie officielle constructeur de 12 à 24 mois selon la marque et le produit (Apple, Samsung, Lenovo, Xiaomi, Sony). En cas de panne couverte, notre service après-vente basé à Casablanca prend en charge votre appareil auprès des centres agréés au Maroc.",
    },
    {
      q: "Quels sont les délais d'expédition et de livraison au Maroc ?",
      a: "À Casablanca et Rabat, la livraison s'effectue généralement sous 24h ouvrées (possibilité de jour même selon l'heure de la commande). Pour Marrakech, Tanger, Fès, Agadir, Meknès et le reste du Royaume, le délai est de 48h à 72h ouvrées.",
    },
    {
      q: "Les prix sont-ils TTC et fournissez-vous une facture marocaine ?",
      a: "Oui, tous les prix affichés sur Hit Tech sont en Dirhams marocains (MAD) toutes taxes comprises (TTC). Une facture légale nominative avec TVA est systématiquement jointe à votre colis et téléchargeable depuis votre compte client.",
    },
    {
      q: "Que faire si je souhaite annuler ou modifier ma commande ?",
      a: "Contactez-nous immédiatement par WhatsApp au +212 6 61 23 45 67 ou par téléphone au +212 5 22 20 30 40 en indiquant votre numéro de commande. Tant que le colis n'a pas quitté notre entrepôt, nous pouvons l'ajuster sans aucun frais.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">FAQ</span>
      </nav>

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Foire Aux Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Trouvez des réponses claires sur la commande, la livraison, la garantie et les paiements chez Hit Tech.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl border border-slate-800 p-6 space-y-3"
          >
            <h3 className="text-base font-bold text-white flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Support WhatsApp box */}
      <div className="p-8 rounded-3xl glass-card border border-cyan-500/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Vous n&apos;avez pas trouvé votre réponse ?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Nos conseillers techniques à Casablanca vous répondent en direct sur WhatsApp.
        </p>
        <a
          href="https://wa.me/212661234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Poser ma question sur WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
