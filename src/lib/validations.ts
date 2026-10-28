// Hit Tech — Schémas de validation Zod stricts pour les entrées utilisateur et Server Actions

import { z } from "zod";

// ── Commande ──
export const orderInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom complet doit comporter au moins 2 caractères.")
    .max(100, "Le nom complet ne peut pas dépasser 100 caractères."),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide.")
    .max(150, "L'email ne peut pas dépasser 150 caractères."),
  phone: z
    .string()
    .trim()
    .min(6, "Le numéro de téléphone est trop court.")
    .max(25, "Le numéro de téléphone ne peut pas dépasser 25 caractères.")
    .regex(/^[+0-9\s.-]+$/, "Format de numéro de téléphone invalide."),
  cityId: z.string().trim().min(1, "La ville de livraison est obligatoire."),
  addressLine1: z
    .string()
    .trim()
    .min(5, "L'adresse de livraison doit être plus détaillée.")
    .max(250, "L'adresse ne peut pas dépasser 250 caractères."),
  addressLine2: z.string().trim().max(250).optional().nullable(),
  postalCode: z.string().trim().max(20).optional().nullable(),
  customerNote: z.string().trim().max(500, "La note ne peut pas dépasser 500 caractères.").optional().nullable(),
  paymentMethod: z.enum(["COD", "STRIPE"]),
});

// ── Authentification ──
export const loginInputSchema = z.object({
  email: z.string().trim().email("Adresse email invalide."),
  password: z.string().min(1, "Le mot de passe est obligatoire."),
});

export const registerInputSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit comporter au moins 2 caractères.")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(50, "Le nom ne peut pas dépasser 50 caractères."),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide.")
    .max(150, "L'email ne peut pas dépasser 150 caractères."),
  phone: z
    .string()
    .trim()
    .max(25, "Le numéro de téléphone ne peut pas dépasser 25 caractères.")
    .optional()
    .nullable(),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères."),
});

export const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est obligatoire."),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit comporter au moins 8 caractères.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères."),
  confirmPassword: z.string().min(1, "La confirmation est obligatoire."),
});

// ── Contact ──
export const contactInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Votre nom doit comporter au moins 2 caractères.")
    .max(100, "Votre nom ne peut pas dépasser 100 caractères."),
  email: z.string().trim().email("Adresse email invalide.").max(150),
  phone: z.string().trim().max(25).optional().nullable(),
  subject: z
    .string()
    .trim()
    .min(3, "L'objet doit comporter au moins 3 caractères.")
    .max(150, "L'objet ne peut pas dépasser 150 caractères."),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit comporter au moins 10 caractères.")
    .max(3000, "Le message ne peut pas dépasser 3000 caractères."),
  orderNumber: z.string().trim().max(50).optional().nullable(),
});
