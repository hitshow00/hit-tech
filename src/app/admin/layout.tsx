import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Console d'Administration | Hit Tech Maroc",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin");
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      {/* Sidebar Latérale Fixe */}
      <AdminSidebar
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
      />

      {/* Zone de Contenu Principal */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
