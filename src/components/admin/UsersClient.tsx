"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toggleUserStatusAction, updateUserRoleAction } from "@/actions/admin";
import { Role } from "@/generated/prisma/enums";
import { formatPrice } from "@/lib/currency";

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date | string;
  ordersCount: number;
  totalSpent: number;
}

interface UsersClientProps {
  users: UserItem[];
  currentUserId: string;
}

export function UsersClient({ users, currentUserId }: UsersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (userId: string, current: boolean) => {
    startTransition(async () => {
      await toggleUserStatusAction(userId, !current);
    });
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    startTransition(async () => {
      await updateUserRoleAction(userId, newRole);
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Recherche & Filtre Rôle ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 focus:border-cyan-500 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "ADMIN", "STAFF", "CUSTOMER"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === role
                  ? "bg-zinc-100 text-zinc-950 font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {role === "ALL" ? "Tous" : role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tableau des Utilisateurs ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Utilisateur</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Rôle</th>
              <th className="py-3 px-4">Commandes</th>
              <th className="py-3 px-4">Dépensé</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = user.id === currentUserId;

                return (
                  <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                    {/* Utilisateur */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <span>{user.firstName} {user.lastName}</span>
                        {isSelf && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            Vous
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="text-zinc-300">{user.email}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {user.phone || "Pas de tél."}
                      </p>
                    </td>

                    {/* Rôle */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        disabled={isSelf || isPending}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border outline-none bg-zinc-950 ${
                          user.role === "ADMIN"
                            ? "text-rose-400 border-rose-500/20"
                            : user.role === "STAFF"
                            ? "text-blue-400 border-blue-500/20"
                            : "text-zinc-400 border-zinc-800"
                        } disabled:opacity-50 cursor-pointer`}
                      >
                        <option value="CUSTOMER">Client</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    </td>

                    {/* Commandes */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">
                        {user.ordersCount}
                      </span>
                    </td>

                    {/* Dépensé */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-400">
                        {formatPrice(user.totalSpent)}
                      </span>
                    </td>

                    {/* Statut Compte */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {user.isActive ? "Actif" : "Suspendu"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={isPending}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            user.isActive
                              ? "hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border-zinc-800 hover:border-rose-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          }`}
                        >
                          {user.isActive ? "Suspendre" : "Réactiver"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
