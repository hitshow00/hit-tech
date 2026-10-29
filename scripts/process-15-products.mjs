import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "C:\\Users\\moi1\\Desktop\\uploads";
const TARGET_PUBLIC = path.resolve("./public/media/products");
const TARGET_STORAGE = path.resolve("./storage/uploads/products");

const PRODUCTS = [
  {
    key: "phone_s25_ultra",
    source: "GALAXY_S25_ULTRA.jpg_82694398.jpg",
  },
  {
    key: "phone_s25",
    source: "GALAXY_S25.jpg_bd0ead75.jpg",
  },
  {
    key: "phone_s24_ultra",
    source: "GALAXY_S24_ULTRA.jpg_577eb158.jpg",
  },
  {
    key: "phone_z_flip_6",
    source: "GALAXY_Z_FLIP_6.jpg_85bdd1d5.jpg",
  },
  {
    key: "phone_z_fold_6",
    source: "GALAXY_FOLD_7.jpg_d4de4a5d.jpg",
  },
  {
    key: "phone_iphone15_pro",
    source: "836a7c84-l-iphone-15-pro-pourrait-voir-son-prix-augmenter-a-plus-de-1500-euros__1200_1200__239-0-1039-800_wtmk.jpeg_0c4e16b4.jpg",
  },
  {
    key: "phone_iphone15_black",
    source: "Apple-iPhone-15-6-1-5G-Double-SIM-256-Go-Noir.jpg_7eb4cbfd.jpg",
  },
  {
    key: "phone_iphone13_mini",
    source: "apple-iphone-13-mini-noir-gsm-distribution-maroc-1-1-1-1-1-1-1-800x800.jpg_b25ffc3a.jpg",
  },
  {
    key: "phone_a56",
    source: "GALAXY_A56_5G.jpg_4f3e4587.jpg",
  },
  {
    key: "phone_a35",
    source: "GALAXY_A37_5G.jpg_f427fffa.jpg",
  },
  {
    key: "phone_a15",
    source: "GALAXY_A17.jpg_8861e7e1.jpg",
  },
  {
    key: "phone_honor_200",
    source: "HONOR_200.jpg_90362bd5.jpg",
  },
  {
    key: "laptop_dell_latitude",
    source: "DELL_LATITUDE.png_b3258edb.jpg",
  },
  {
    key: "tablet_galaxy_tab_a8",
    source: "GALAXY_TAB_A8.jpg_a70e81a3.jpg",
  },
  {
    key: "acc_batterie_20000",
    source: "batterie.jpg_b60aa0c7.jpg",
  },
];

async function main() {
  console.log("🚀 Début du traitement des 15 images produits...");
  await fs.mkdir(TARGET_PUBLIC, { recursive: true });
  await fs.mkdir(TARGET_STORAGE, { recursive: true });

  const results = [];

  for (const item of PRODUCTS) {
    const srcPath = path.join(SOURCE_DIR, item.source);
    try {
      const buffer = await fs.readFile(srcPath);

      // Traitement 1200w
      const buf1200 = await sharp(buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer();

      // Traitement 640w
      const buf640 = await sharp(buffer)
        .resize(640, 640, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      // Traitement 160w
      const buf160 = await sharp(buffer)
        .resize(160, 160, { fit: "cover" })
        .webp({ quality: 78 })
        .toBuffer();

      const f1200 = `${item.key}-ht2026-1200.webp`;
      const f640 = `${item.key}-ht2026-640.webp`;
      const f160 = `${item.key}-ht2026-160.webp`;

      // Sauvegarder dans public et storage
      await fs.writeFile(path.join(TARGET_PUBLIC, f1200), buf1200);
      await fs.writeFile(path.join(TARGET_PUBLIC, f640), buf640);
      await fs.writeFile(path.join(TARGET_PUBLIC, f160), buf160);

      await fs.writeFile(path.join(TARGET_STORAGE, f1200), buf1200);
      await fs.writeFile(path.join(TARGET_STORAGE, f640), buf640);
      await fs.writeFile(path.join(TARGET_STORAGE, f160), buf160);

      console.log(`✓ [${item.key}] Traité et sauvegardé avec succès`);
      results.push({
        key: item.key,
        url: `/media/products/${f1200}`,
        mediumUrl: `/media/products/${f640}`,
        thumbUrl: `/media/products/${f160}`,
      });
    } catch (err) {
      console.error(`✗ Erreur sur ${item.key}:`, err);
    }
  }

  console.log("\n✨ Terminé ! Nombre d'images générées :", results.length);
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
