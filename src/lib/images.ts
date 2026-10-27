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

export async function processAndSaveProductImage(
  buffer: Buffer,
  filenameHint = "product"
): Promise<ProcessedProductImage> {
  const dir = path.resolve(UPLOAD_ROOT, "products");
  await fs.mkdir(dir, { recursive: true });

  const hash = crypto.randomBytes(12).toString("hex");
  const cleanHint = filenameHint.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30) || "product";

  const largeFilename = `${cleanHint}-${hash}-1200.webp`;
  const mediumFilename = `${cleanHint}-${hash}-640.webp`;
  const thumbFilename = `${cleanHint}-${hash}-160.webp`;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 1200;

  // 1200w
  const largeBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // 640w
  const mediumBuffer = await sharp(buffer)
    .resize(640, 640, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 160w miniature
  const thumbBuffer = await sharp(buffer)
    .resize(160, 160, { fit: "cover" })
    .webp({ quality: 75 })
    .toBuffer();

  await fs.writeFile(path.join(dir, largeFilename), largeBuffer);
  await fs.writeFile(path.join(dir, mediumFilename), mediumBuffer);
  await fs.writeFile(path.join(dir, thumbFilename), thumbBuffer);

  return {
    url: `/media/products/${largeFilename}`,
    mediumUrl: `/media/products/${mediumFilename}`,
    thumbUrl: `/media/products/${thumbFilename}`,
    width,
    height,
  };
}
