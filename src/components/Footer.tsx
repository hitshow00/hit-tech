import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 pt-16 pb-12 mt-24 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Colonne 1 : À propos */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-black text-xs tracking-wider">
                HT
              </div>
              <span className="font-extrabold text-base tracking-wider text-white uppercase">
                Hit Tech
              </span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-xs text-xs">
              Plateforme technologique de pointe dédiée aux équipements numériques, smartphones, ordinateurs et audio haute fidélité.
            </p>
            <div className="space-y-1.5 text-zinc-400 text-xs">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                contact@hittech.ma
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                +212 5 22 20 30 40
              </p>
            </div>
          </div>

          {/* Colonne 2 : Produits */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
              Catalogue
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/boutique" className="hover:text-white transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/boutique?categorie=smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/boutique?categorie=pc-portables" className="hover:text-white transition-colors">
                  PC Portables
                </Link>
              </li>
              <li>
                <Link href="/boutique?categorie=tablettes" className="hover:text-white transition-colors">
                  Tablettes
                </Link>
              </li>
              <li>
                <Link href="/boutique?categorie=audio-casques" className="hover:text-white transition-colors">
                  Audio & Casques
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Support & Suivi */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
              Assistance
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/suivi" className="hover:text-white transition-colors">
                  Suivi de commande
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Service client
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Foire Aux Questions
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="hover:text-white transition-colors">
                  Modalités de livraison
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Légal */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
              Informations
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/conditions-generales-de-vente" className="hover:text-white transition-colors">
                  Conditions Générales de Vente
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/retours-garantie" className="hover:text-white transition-colors">
                  Garanties & Retours
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page minimaliste */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-[11px]">
          <p>© {new Date().getFullYear()} Hit Tech. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Paiement sécurisé</span>
            <span>•</span>
            <span>Garantie constructeur</span>
            <span>•</span>
            <span>Devise : MAD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
