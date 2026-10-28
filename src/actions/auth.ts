"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma, Role } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
  destroyCurrentSession,
  getCurrentUser,
} from "@/lib/auth";
import { getOrCreateCartId } from "@/lib/cart";
import {
  loginInputSchema,
  registerInputSchema,
  changePasswordInputSchema,
} from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
}

export async function loginAction(formData: FormData) {
  try {
    const rawEmail = String(formData.get("email") || "").trim().toLowerCase();
    const rawPassword = String(formData.get("password") || "");

    const parsed = loginInputSchema.safeParse({ email: rawEmail, password: rawPassword });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Identifiants invalides." };
    }
    const { email, password } = parsed.data;

    // Protection anti-force brute (5 tentatives max par 15 min par IP/email)
    const ip = await getClientIp();
    const rateCheck = checkRateLimit(`${ip}:${email}`, {
      keyPrefix: "login_attempt",
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: `Trop de tentatives infructueuses. Veuillez patienter ${rateCheck.resetInSeconds} secondes avant de réessayer.`,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "Identifiants incorrects ou compte suspendu." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Identifiants incorrects." };
    }

    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Lier le panier courant à ce compte
    await getOrCreateCartId(user.id);

    revalidatePath("/", "layout");
    return {
      success: true,
      isAdmin: user.role === Role.ADMIN || user.role === Role.STAFF,
    };
  } catch (error: any) {
    console.error("Erreur connexion :", error);
    return { success: false, error: "Une erreur est survenue lors de la connexion." };
  }
}

export async function registerAction(formData: FormData) {
  try {
    const rawData = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim() || null,
      password: String(formData.get("password") || ""),
    };

    const parsed = registerInputSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Données d'inscription invalides." };
    }
    const { firstName, lastName, email, phone, password } = parsed.data;

    // Protection anti-spam création de compte (3 inscriptions max par heure par IP)
    const ip = await getClientIp();
    const rateCheck = checkRateLimit(ip, {
      keyPrefix: "register_attempt",
      maxRequests: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: `Limite de création de comptes atteinte pour votre connexion. Veuillez réessayer plus tard.`,
      };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Un compte existe déjà avec cette adresse email." };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });

    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);
    await getOrCreateCartId(user.id);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Erreur inscription :", error);
    return { success: false, error: "Une erreur est survenue lors de la création de votre compte." };
  }
}

export async function logoutAction() {
  await destroyCurrentSession();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
    }

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!firstName || !lastName) {
      return { success: false, error: "Le nom et le prénom sont obligatoires." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
      },
    });

    revalidatePath("/compte");
    return { success: true, message: "Profil mis à jour avec succès." };
  } catch (error) {
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

export async function changePasswordAction(formData: FormData) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
    }

    const rawData = {
      currentPassword: String(formData.get("currentPassword") || ""),
      newPassword: String(formData.get("newPassword") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    };

    const parsed = changePasswordInputSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Données invalides." };
    }
    const { currentPassword, newPassword, confirmPassword } = parsed.data;

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Les nouveaux mots de passe ne correspondent pas." };
    }

    // Rate limiting sur le changement de mot de passe
    const ip = await getClientIp();
    const rateCheck = checkRateLimit(`${ip}:${user.id}`, {
      keyPrefix: "change_password",
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateCheck.success) {
      return {
        success: false,
        error: `Trop de tentatives de modification de mot de passe. Veuillez patienter ${rateCheck.resetInSeconds} secondes.`,
      };
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!fullUser) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    const isValid = await verifyPassword(currentPassword, fullUser.passwordHash);
    if (!isValid) {
      return { success: false, error: "Le mot de passe actuel est incorrect." };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    revalidatePath("/compte");
    return { success: true, message: "Mot de passe modifié avec succès !" };
  } catch (error: any) {
    return { success: false, error: "Erreur lors du changement de mot de passe." };
  }
}
