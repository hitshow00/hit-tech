import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const UPLOAD_ROOT = process.env.UPLOAD_DIR || "./storage/uploads";

export interface ProcessedProductImage {
  url: string;
  mediumUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
}

/**
 * Traite et sauvegarde les différentes variantes d'image de produit.
 * En environnement Serverless sans disque persistant (ex. Vercel Lambda), le système de fichiers
 * local est en lecture seule (`EROFS`). Dans ce cas, une erreur explicite est remontée pour
 * guider la configuration d'un stockage objet durable (AWS S3, Cloudflare R2 ou Supabase Storage).
 */
export async function processAndSaveProductImage(
  buffer: Buffer,
  filenameHint = "product"
): Promise<ProcessedProductImage> {
  const dir = path.resolve(UPLOAD_ROOT, "products");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err: any) {
    if (err?.code === "EROFS" || err?.code === "EACCES") {
      throw new Error(
        "Stockage local en lecture seule ou inaccessible. Pour un déploiement serverless, connectez un bucket S3 ou Cloudflare R2."
      );
    }
    throw err;
  }

  const hash = crypto.randomBytes(12).toString("hex");
  const cleanHint = filenameHint.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30) || "product";

  const largeFilename = `${cleanHint}-${hash}-1200.webp`;
  const mediumFilename = `${cleanHint}-${hash}-640.webp`;
  const thumbFilename = `${cleanHint}-${hash}-160.webp`;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 1200;

  // 1200w - Haute résolution
  const largeBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // 640w - Fiche produit et desktop cards
  const mediumBuffer = await sharp(buffer)
    .resize(640, 640, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 160w - Miniature cart & table admin
  const thumbBuffer = await sharp(buffer)
    .resize(160, 160, { fit: "cover" })
    .webp({ quality: 75 })
    .toBuffer();

  try {
    await fs.writeFile(path.join(dir, largeFilename), largeBuffer);
    await fs.writeFile(path.join(dir, mediumFilename), mediumBuffer);
    await fs.writeFile(path.join(dir, thumbFilename), thumbBuffer);
  } catch (err: any) {
    if (err?.code === "EROFS" || err?.code === "EACCES") {
      throw new Error(
        "Impossible d'écrire l'image : système de fichiers en lecture seule. Un stockage persistant (S3 / R2) est requis."
      );
    }
    throw err;
  }

  return {
    url: `/media/products/${largeFilename}`,
    mediumUrl: `/media/products/${mediumFilename}`,
    thumbUrl: `/media/products/${thumbFilename}`,
    width,
    height,
  };
}
