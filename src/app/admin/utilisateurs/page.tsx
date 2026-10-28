import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role, PaymentStatus } from "@/lib/prisma";
import { UsersClient } from "@/components/admin/UsersClient";
import { Users, UserPlus, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Gestion des Utilisateurs | Hit Tech Admin",
};

export default async function AdminUsersPage() {
  const { user: currentUser } = await getCurrentUser();
  if (!currentUser || (currentUser.role !== Role.ADMIN && currentUser.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin/utilisateurs");
  }

  // Récupération des utilisateurs avec leurs commandes
  const rawUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          paymentStatus: true,
        },
      },
    },
  });

  const formattedUsers = rawUsers.map((u) => {
    const ordersCount = u.orders.length;
    const totalSpent = u.orders
      .filter((o) => o.paymentStatus === PaymentStatus.PAID)
      .reduce((acc, o) => acc + o.total, 0);

    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      ordersCount,
      totalSpent,
    };
  });

  const staffCount = formattedUsers.filter((u) => u.role === Role.ADMIN || u.role === Role.STAFF).length;
  const clientCount = formattedUsers.filter((u) => u.role === Role.CUSTOMER).length;

  return (
    <div className="space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Accès & Sécurité
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Gestion des Utilisateurs
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gérez les comptes clients, leurs commandes passées et attribuez les droits administrateurs / équipe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="text-cyan-400 font-bold">{staffCount}</span> membre(s) de l&apos;équipe
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="text-emerald-400 font-bold">{clientCount}</span> client(s)
          </div>
        </div>
      </div>

      <UsersClient users={formattedUsers} currentUserId={currentUser.id} />
    </div>
  );
}
