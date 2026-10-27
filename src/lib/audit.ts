import { prisma } from "@/lib/prisma";

export interface LogAuditParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  details?: Record<string, unknown> | null;
  ip?: string | null;
}

export async function logAudit(params: LogAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        summary: params.summary,
        details: (params.details ?? {}) as any,
        ip: params.ip ?? null,
      },
    });
  } catch (error) {
    // Ne bloque pas la transaction principale en cas d'erreur de journalisation
    console.error("Erreur d'audit :", error);
  }
}
