"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContactAction } from "@/actions/contact";
import {
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactAction(formData);
    setLoading(false);

    if (res.success) {
      setStatus({
        success: true,
        message: res.message || "Votre message a bien été envoyé !",
      });
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus({
        success: false,
        message: res.error || "Impossible d'envoyer votre message.",
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-zinc-300">Contact</span>
      </nav>

      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Support & Renseignements
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Nous Contacter
        </h1>
        <p className="text-xs text-zinc-400">
          Notre équipe technique est à votre disposition pour vous orienter et répondre à vos questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ── Coordonnées ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Coordonnées
            </h2>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white">Email</strong>
                  <span className="text-zinc-400">contact@hittech.ma</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white">Téléphone</strong>
                  <span className="text-zinc-400 font-mono">+212 5 22 20 30 40</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white">Disponibilité</strong>
                  <span className="text-zinc-400">Du lundi au samedi, 09h00 - 19h00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Formulaire de Contact ── */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Formulaire de contact
            </h2>

            {status && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  status.success
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                }`}
              >
                {status.success && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Votre nom"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="nom@exemple.com"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+212 ..."
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Référence commande
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="HT-..."
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Objet de la demande *
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Renseignement technique, suivi, etc."
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Votre message..."
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
