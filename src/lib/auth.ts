import crypto from "node:crypto";
import { cookies } from "next/headers";
import { hash, verify } from "@node-rs/argon2";
import { prisma, type User, Role } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "ht_session";
const SESSION_DURATION_DAYS = 30;

// Hachage du token de session avant stockage en base (défense en profondeur)
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(plainText: string): Promise<string> {
  return hash(plainText, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPassword(plainText: string, passwordHash: string): Promise<boolean> {
  try {
    return await verify(passwordHash, plainText);
  } catch {
    return false;
  }
}

export async function createSession(userId: string, userAgent?: string, ip?: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      userAgent: userAgent?.slice(0, 500) ?? null,
      ip: ip?.slice(0, 64) ?? null,
    },
  });

  return { token, expiresAt };
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<{
  user: User | null;
  sessionId: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return { user: null, sessionId: null };
    }

    const tokenHash = hashToken(token);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) {
      return { user: null, sessionId: null };
    }

    // Session expirée ou utilisateur inactif
    if (session.expiresAt < new Date() || !session.user.isActive) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return { user: null, sessionId: null };
    }

    return { user: session.user, sessionId: session.id };
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.digest?.startsWith?.("NEXT_")) {
      throw error;
    }
    console.error("getCurrentUser error:", error);
    return { user: null, sessionId: null };
  }
}

export async function requireUser(): Promise<User> {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireStaffOrAdmin(): Promise<User> {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (user.role !== Role.ADMIN && user.role !== Role.STAFF) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session.deleteMany({ where: { tokenHash } }).catch(() => {});
  }
  await clearSessionCookie();
}
