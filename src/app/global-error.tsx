"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-bold mb-4">
          !
        </div>
        <h1 className="text-xl font-bold mb-2">Service momentanément indisponible</h1>
        <p className="text-xs text-zinc-400 max-w-sm mb-6">
          Une erreur imprévue est survenue au niveau du système. Veuillez rafraîchir la page.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors"
        >
          Recharger l&apos;application
        </button>
      </body>
    </html>
  );
}
