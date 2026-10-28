import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role, ReviewStatus } from "@/lib/prisma";
import { ReviewsClient } from "@/components/admin/ReviewsClient";
import { Star, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Modération des Avis | Hit Tech Admin",
};

export default async function AdminReviewsPage() {
  const { user } = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin/avis");
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  const pendingCount = reviews.filter((r) => r.status === ReviewStatus.PENDING).length;

  return (
    <div className="space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Confiance & Preuve Sociale
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Modération des Avis Clients
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Validez ou modérez les retours clients déposés sur les produits du catalogue.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>{pendingCount} avis en attente de modération</span>
          </div>
        )}
      </div>

      <ReviewsClient reviews={reviews} />
    </div>
  );
}
