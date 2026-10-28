"use client";

import { useState, useTransition } from "react";
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Search,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { saveDiscountAction, toggleDiscountAction, deleteDiscountAction } from "@/actions/admin";
import { DiscountType } from "@/generated/prisma/enums";

interface DiscountCodeItem {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: Date | string;
}

interface DiscountsClientProps {
  discounts: DiscountCodeItem[];
}

export function DiscountsClient({ discounts }: DiscountsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<DiscountType>("PERCENT");
  const [value, setValue] = useState(10);
  const [minSubtotal, setMinSubtotal] = useState(0);
  const [maxUses, setMaxUses] = useState<string>("");

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleDiscountAction(id, !current);
    });
  };

  const handleDelete = (id: string, codeName: string) => {
    if (!confirm(`Supprimer définitivement le code promo « ${codeName} » ?`)) return;
    startTransition(async () => {
      await deleteDiscountAction(id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.append("code", code);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("value", String(value));
    formData.append("minSubtotal", String(minSubtotal));
    if (maxUses) formData.append("maxUses", maxUses);
    formData.append("isActive", "true");

    startTransition(async () => {
      const res = await saveDiscountAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        setCode("");
        setDescription("");
        setValue(10);
        setMinSubtotal(0);
        setMaxUses("");
      } else {
        setErrorMsg(res.error || "Erreur enregistrement code");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Barre d'actions & Recherche ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher un code promotionnel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 focus:border-cyan-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-bold transition-opacity cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Code Promo</span>
        </button>
      </div>

      {/* ── Tableau des Codes Promo ── */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Réduction</th>
              <th className="py-3 px-4">Panier Minimum</th>
              <th className="py-3 px-4">Utilisations</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredDiscounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                  Aucun code promo créé pour le moment.
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                      {d.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {d.description || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white">
                      {d.type === "PERCENT" ? `${d.value}%` : formatPrice(d.value)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {d.minSubtotal > 0 ? formatPrice(d.minSubtotal) : "Aucun"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-zinc-300 font-medium">
                      {d.usedCount}
                      {d.maxUses ? ` / ${d.maxUses}` : " (illimité)"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggle(d.id, d.isActive)}
                      disabled={isPending}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        d.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      {d.isActive ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(d.id, d.code)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Supprimer le code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal de Création Code Promo ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Nouveau Code Promo</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Code Promo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: SUMMER2026, RAMADAN, WELCOME10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-white placeholder-zinc-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="ex: 10% de réduction pour les nouveaux clients"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Type de remise
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="PERCENT">Pourcentage (%)</option>
                    <option value="FIXED">Montant fixe (DH)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Valeur ({type === "PERCENT" ? "%" : "DH"}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={type === "PERCENT" ? 100 : 10000}
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Panier min. (DH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = sans min."
                    value={minSubtotal}
                    onChange={(e) => setMinSubtotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Utilisations max
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Illimité"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold transition-opacity shadow-lg shadow-cyan-500/20"
                >
                  {isPending ? "Création..." : "Créer le code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
