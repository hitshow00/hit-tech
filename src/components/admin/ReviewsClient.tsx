"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import { updateReviewStatusAction } from "@/actions/admin";
import { ReviewStatus } from "@/generated/prisma/enums";

interface ReviewRow {
  id: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  createdAt: Date | string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ReviewsClientProps {
  reviews: ReviewRow[];
}

export function ReviewsClient({ reviews }: ReviewsClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStatus = (reviewId: string, status: ReviewStatus) => {
    startTransition(async () => {
      await updateReviewStatusAction(reviewId, status);
    });
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.body.toLowerCase().includes(q) ||
      r.product.name.toLowerCase().includes(q) ||
      r.user.firstName.toLowerCase().includes(q) ||
      r.user.lastName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const tabs = [
    { key: "ALL", label: "Tous", count: reviews.length },
    { key: "PENDING", label: "En attente", count: reviews.filter((r) => r.status === "PENDING").length },
    { key: "APPROVED", label: "Approuvés", count: reviews.filter((r) => r.status === "APPROVED").length },
    { key: "REJECTED", label: "Rejetés", count: reviews.filter((r) => r.status === "REJECTED").length },
  ];

  return (
    <div className="space-y-6">
      {/* ── Onglets & Recherche ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                statusFilter === tab.key
                  ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.key
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Filtrer les avis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-zinc-950 border border-zinc-900 focus:border-cyan-500 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* ── Liste des Avis ── */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-500">
            Aucun avis dans cette catégorie.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-zinc-800 transition-colors"
            >
              <div className="space-y-2 flex-1">
                {/* Produit & Auteur */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    href={`/produit/${review.product.slug}`}
                    target="_blank"
                    className="font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>{review.product.name}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </Link>
                  <span className="text-zinc-600">•</span>
                  <span className="font-semibold text-white">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Achat vérifié
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {/* Étoiles & Titre */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating ? "fill-amber-400" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="text-xs font-bold text-white">{review.title}</h4>
                </div>

                {/* Commentaire */}
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
                  « {review.body} »
                </p>
              </div>

              {/* Actions de Modération */}
              <div className="flex md:flex-col items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    review.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : review.status === "REJECTED"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {review.status === "APPROVED"
                    ? "Approuvé"
                    : review.status === "REJECTED"
                    ? "Rejeté"
                    : "En attente"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatus(review.id, ReviewStatus.APPROVED)}
                    disabled={isPending || review.status === "APPROVED"}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 disabled:opacity-30 transition-colors"
                    title="Approuver et publier l'avis"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatus(review.id, ReviewStatus.REJECTED)}
                    disabled={isPending || review.status === "REJECTED"}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 disabled:opacity-30 transition-colors"
                    title="Rejeter l'avis"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
