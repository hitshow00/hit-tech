import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role } from "@/lib/prisma";
import { DiscountsClient } from "@/components/admin/DiscountsClient";
import { Tag, Sparkles, Percent } from "lucide-react";

export const metadata = {
  title: "Promotions & Codes Réduction | Hit Tech Admin",
};

export default async function AdminPromotionsPage() {
  const { user } = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin/promotions");
  }

  const discounts = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCount = discounts.filter((d) => d.isActive).length;
  const totalUses = discounts.reduce((acc, d) => acc + d.usedCount, 0);

  return (
    <div className="space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Marketing & Conversions
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Promotions & Codes Réduction
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Créez des remises en pourcentage ou montant fixe en Dirhams pour booster vos ventes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="text-emerald-400 font-bold">{activeCount}</span> actif(s) sur {discounts.length}
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="text-cyan-400 font-bold">{totalUses}</span> utilisation(s) cumulées
          </div>
        </div>
      </div>

      {/* ── Client Interactif ── */}
      <DiscountsClient discounts={discounts} />
    </div>
  );
}
