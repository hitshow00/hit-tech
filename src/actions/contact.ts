"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { contactInputSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function submitContactAction(formData: FormData) {
  try {
    const rawData = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim() || null,
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      orderNumber: String(formData.get("orderNumber") || "").trim() || null,
    };

    const parsed = contactInputSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Données du formulaire invalides." };
    }
    const { name, email, phone, subject, message, orderNumber } = parsed.data;

    // Rate limiting anti-spam
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
    const rateCheck = checkRateLimit(`${ip}:${email}`, {
      keyPrefix: "contact_form",
      maxRequests: 4,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return {
        success: false,
        error: `Trop de messages envoyés récemment. Veuillez patienter ${rateCheck.resetInSeconds} secondes.`,
      };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        orderNumber,
      },
    });

    return {
      success: true,
      message: "Votre message a bien été envoyé. Notre équipe à Casablanca vous répondra sous 24h ouvrées.",
    };
  } catch (error) {
    console.error("Erreur submitContactAction:", error);
    return { success: false, error: "Impossible d'envoyer votre message. Veuillez réessayer ou nous contacter par WhatsApp." };
  }
}
