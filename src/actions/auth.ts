"use server";

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

export async function loginAction(formData: FormData) {
  try {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      return { success: false, error: "Veuillez renseigner votre email et mot de passe." };
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
    return { success: false, error: error?.message || "Une erreur est survenue lors de la connexion." };
  }
}

export async function registerAction(formData: FormData) {
  try {
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");

    if (!firstName || !lastName || !email || !password) {
      return { success: false, error: "Veuillez renseigner tous les champs obligatoires." };
    }

    if (password.length < 8) {
      return { success: false, error: "Le mot de passe doit comporter au moins 8 caractères." };
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

    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Veuillez remplir tous les champs." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Le nouveau mot de passe doit comporter au moins 8 caractères." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Les nouveaux mots de passe ne correspondent pas." };
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
    return { success: false, error: error?.message || "Erreur lors du changement de mot de passe." };
  }
}
