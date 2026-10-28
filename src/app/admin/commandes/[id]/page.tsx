import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma, Role } from "@/lib/prisma";
import { OrderDetailClient } from "@/components/admin/OrderDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { user } = await getCurrentUser();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
    redirect("/compte/connexion?callback=/admin/commandes");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      history: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
