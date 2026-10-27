"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactAction(formData: FormData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const orderNumber = String(formData.get("orderNumber") || "").trim();

    if (!name || !email || !subject || !message) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        orderNumber: orderNumber || null,
      },
    });

    return {
      success: true,
      message: "Votre message a bien été envoyé. Notre équipe à Casablanca vous répondra sous 24h ouvrées.",
    };
  } catch (error) {
    return { success: false, error: "Impossible d'envoyer votre message. Veuillez réessayer ou nous contacter par WhatsApp." };
  }
}
