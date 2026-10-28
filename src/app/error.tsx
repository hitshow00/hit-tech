"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-amber-400 mb-6 font-mono text-lg font-bold">
        !
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-main tracking-tight mb-2">
        Une interruption est survenue
      </h1>

      <p className="text-secondary text-sm max-w-md mb-8 leading-relaxed">
        Le serveur a rencontré un incident passager lors du chargement. Vous pouvez réessayer immédiatement.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-lg btn-theme-primary text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réessayer</span>
        </button>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg btn-theme-secondary text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Accueil</span>
        </Link>
      </div>
    </div>
  );
}
