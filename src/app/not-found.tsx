import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 mb-6 font-mono text-xl font-bold">
        404
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-main tracking-tight mb-2">
        Page Introuvable
      </h1>

      <p className="text-secondary text-sm max-w-md mb-8 leading-relaxed">
        Le lien que vous avez suivi est peut-être expiré, ou l&apos;adresse a été mal saisie.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg btn-theme-secondary text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        <Link
          href="/boutique"
          className="px-5 py-2.5 rounded-lg btn-theme-primary text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Explorer la boutique</span>
        </Link>
      </div>
    </div>
  );
}
