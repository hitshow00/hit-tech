"use client";

import { useState } from "react";
import { submitReviewAction } from "@/actions/reviews";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";

export function ReviewForm({ productId, productName }: { productId: string; productName: string }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.set("productId", productId);
    formData.set("rating", String(rating));
    formData.set("title", title);
    formData.set("body", body);

    const res = await submitReviewAction(formData);
    setLoading(false);

    if (res.success) {
      setStatus({ success: true, message: res.message || "Avis enregistré avec succès !" });
      setTitle("");
      setBody("");
    } else {
      setStatus({ success: false, message: res.error || "Une erreur est survenue." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-zinc-950 p-6 border border-zinc-900 space-y-4">
      <h3 className="font-bold text-white text-xs uppercase tracking-wider">
        Donner un avis sur {productName}
      </h3>

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

      {/* Note étoiles */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Note</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 hover:scale-110 transition-transform focus:outline-none"
              aria-label={`Attribuer ${star} étoiles sur 5`}
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-white text-white"
                    : "text-zinc-800"
                }`}
              />
            </button>
          ))}
          <span className="text-xs text-zinc-400 ml-2 font-medium">
            {rating} / 5
          </span>
        </div>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Titre
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : Performance conforme aux attentes"
          className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
      </div>

      {/* Commentaire */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Commentaire
        </label>
        <textarea
          required
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Détails sur l'utilisation du produit..."
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
            <span>Envoi...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Publier l&apos;avis</span>
          </>
        )}
      </button>
    </form>
  );
}
