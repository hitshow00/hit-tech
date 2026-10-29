import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "C:\\Users\\moi1\\Desktop\\uploads";
const TARGET_PUBLIC = path.resolve("./public/media/products");
const TARGET_STORAGE = path.resolve("./storage/uploads/products");

const PRODUCTS = [
  {
    key: "phone_s25_ultra",
    source: "GALAXY_S24_ULTRA_NOIR.jpg_ede83c6a.jpg", // Studio pro 1024x1024 titane noir & S-Pen (remplace la photo avec main)
    removeBg: false,
  },
  {
    key: "phone_s25",
    source: "GALAXY_S25.jpg_bd0ead75.jpg", // Studio pro 1200x896 bleu minéral
    removeBg: false,
  },
  {
    key: "phone_s24_ultra",
    source: "GALAXY_S24_ULTRA.jpg_577eb158.jpg", // Gris titane avec S-Pen isolé en transparence sans bordure blanche
    removeBg: true,
  },
  {
    key: "phone_z_flip_6",
    source: "GALAXY_Z_FLIP_6.jpg_85bdd1d5.jpg", // Studio pro 1024x1024 vert menthe
    removeBg: false,
  },
  {
    key: "phone_z_fold_6",
    source: "GALAXY_FOLD_7.jpg_d4de4a5d.jpg", // Studio pro 1024x1024
    removeBg: false,
  },
  {
    key: "phone_iphone15_pro",
    source: "836a7c84-l-iphone-15-pro-pourrait-voir-son-prix-augmenter-a-plus-de-1500-euros__1200_1200__239-0-1039-800_wtmk.jpeg_0c4e16b4.jpg",
    removeBg: false,
  },
  {
    key: "phone_iphone15_black",
    source: "Apple-iPhone-15-6-1-5G-Double-SIM-256-Go-Noir.jpg_7eb4cbfd.jpg",
    removeBg: true,
  },
  {
    key: "phone_iphone13_mini",
    source: "apple-iphone-13-mini-noir-gsm-distribution-maroc-1-1-1-1-1-1-1-800x800.jpg_b25ffc3a.jpg",
    removeBg: true,
  },
  {
    key: "phone_a56",
    source: "GALAXY_A53_5G.jpg_7d850b68.jpg", // Studio 1024x1024 épuré sans texte flyer
    removeBg: false,
  },
  {
    key: "phone_a35",
    source: "GALAXY_A37_5G.jpg_f427fffa.jpg", // Studio 1024x1024
    removeBg: false,
  },
  {
    key: "phone_a15",
    source: "GALAXY_A17.jpg_8861e7e1.jpg", // Studio 768x1376
    removeBg: false,
  },
  {
    key: "phone_honor_200",
    source: "HONOR_200.jpg_90362bd5.jpg", // Isolé en transparence sans cadre blanc
    removeBg: true,
  },
  {
    key: "laptop_dell_latitude",
    source: "DELL_LATITUDE.png_b3258edb.jpg", // Isolé en transparence
    removeBg: true,
  },
  {
    key: "tablet_galaxy_tab_a8",
    source: "GALAXY_TAB_A8.jpg_a70e81a3.jpg", // Isolé en transparence
    removeBg: true,
  },
  {
    key: "acc_batterie_20000",
    source: "batterie.jpg_b60aa0c7.jpg", // Isolé en transparence
    removeBg: true,
  },
];

async function removeWhiteBackgroundBFS(sharpBuffer) {
  const img = sharp(sharpBuffer).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  function brightness(idx) {
    return (data[idx * 4] + data[idx * 4 + 1] + data[idx * 4 + 2]) / 3;
  }

  function isWhiteBg(idx) {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    return r >= 232 && g >= 232 && b >= 232;
  }

  // Initialisation sur les 4 bordures
  for (let x = 0; x < w; x++) {
    if (isWhiteBg(x)) {
      visited[x] = 1;
      queue.push(x);
    }
    const btm = (h - 1) * w + x;
    if (isWhiteBg(btm)) {
      visited[btm] = 1;
      queue.push(btm);
    }
  }
  for (let y = 0; y < h; y++) {
    const lft = y * w;
    const rgt = y * w + (w - 1);
    if (!visited[lft] && isWhiteBg(lft)) {
      visited[lft] = 1;
      queue.push(lft);
    }
    if (!visited[rgt] && isWhiteBg(rgt)) {
      visited[rgt] = 1;
      queue.push(rgt);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [];
    if (cx > 0) neighbors.push(curr - 1);
    if (cx < w - 1) neighbors.push(curr + 1);
    if (cy > 0) neighbors.push(curr - w);
    if (cy < h - 1) neighbors.push(curr + w);

    for (const n of neighbors) {
      if (!visited[n] && isWhiteBg(n)) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  // Transparence complète sur le fond détecté
  for (let i = 0; i < w * h; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  // Lissage progressif anti-crénelage sur les pixels de transition
  for (let i = 0; i < w * h; i++) {
    if (!visited[i]) {
      const cx = i % w;
      const cy = Math.floor(i / w);
      let hasBgNeighbor = false;
      if (cx > 0 && visited[i - 1]) hasBgNeighbor = true;
      if (cx < w - 1 && visited[i + 1]) hasBgNeighbor = true;
      if (cy > 0 && visited[i - w]) hasBgNeighbor = true;
      if (cy < h - 1 && visited[i + w]) hasBgNeighbor = true;

      if (hasBgNeighbor) {
        const br = brightness(i);
        if (br > 185) {
          const factor = Math.max(0, Math.min(1, (255 - br) / 70));
          data[i * 4 + 3] = Math.round(255 * factor);
        }
      }
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function main() {
  console.log("🚀 Lancement du traitement haute fidélité pour les 15 produits...");
  await fs.mkdir(TARGET_PUBLIC, { recursive: true });
  await fs.mkdir(TARGET_STORAGE, { recursive: true });

  const results = [];

  for (const item of PRODUCTS) {
    const srcPath = path.join(SOURCE_DIR, item.source);
    try {
      let buffer = await fs.readFile(srcPath);

      if (item.removeBg) {
        console.log(`  ✂ Détourage intelligent en cours pour [${item.key}]...`);
        buffer = await removeWhiteBackgroundBFS(buffer);
      }

      // Résolution 1200w
      const buf1200 = await sharp(buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88, effort: 6 })
        .toBuffer();

      // Résolution 640w
      const buf640 = await sharp(buffer)
        .resize(640, 640, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 5 })
        .toBuffer();

      // Résolution 160w
      const buf160 = await sharp(buffer)
        .resize(160, 160, { fit: "cover" })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const f1200 = `${item.key}-ht2026-1200.webp`;
      const f640 = `${item.key}-ht2026-640.webp`;
      const f160 = `${item.key}-ht2026-160.webp`;

      // Sauvegarde dans public/media/products
      await fs.writeFile(path.join(TARGET_PUBLIC, f1200), buf1200);
      await fs.writeFile(path.join(TARGET_PUBLIC, f640), buf640);
      await fs.writeFile(path.join(TARGET_PUBLIC, f160), buf160);

      // Sauvegarde dans storage/uploads/products
      await fs.writeFile(path.join(TARGET_STORAGE, f1200), buf1200);
      await fs.writeFile(path.join(TARGET_STORAGE, f640), buf640);
      await fs.writeFile(path.join(TARGET_STORAGE, f160), buf160);

      console.log(`✓ [${item.key}] Prêt (WebP 1200w/640w/160w générés)`);
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

  console.log(`\n✨ Traitement terminé avec succès ! ${results.length} / 15 produits traités.`);
}

main().catch(console.error);
