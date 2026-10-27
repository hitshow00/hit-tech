"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { Lock, Mail, User, Phone, Loader2, ArrowRight } from "lucide-react";

export default function InscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await registerAction(formData);
    setLoading(false);

    if (res.success) {
      router.push("/compte");
      router.refresh();
    } else {
      setError(res.error || "Une erreur est survenue lors de l'inscription.");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-600/30 font-black text-xl">
            H
          </div>
          <h1 className="text-2xl font-black text-white">Créer un Compte Hit Tech</h1>
          <p className="text-xs text-slate-400">
            Profitez du suivi de vos commandes, de remises exclusives et d&apos;un passage en caisse accéléré.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Yassine"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="El Mansouri"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Adresse email *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="yassine@exemple.ma"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Téléphone (Maroc)
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="06 12 34 56 78"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mot de passe (8 caractères minimum) *
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl gradient-brand text-white font-bold text-xs shadow-lg shadow-cyan-600/25 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Création du compte...</span>
              </>
            ) : (
              <>
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/compte/connexion"
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
