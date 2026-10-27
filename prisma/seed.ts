import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { hash } from "@node-rs/argon2";
import { PrismaClient, Role, ProductStatus, OrderStatus, PaymentMethod, PaymentStatus, ReviewStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { processAndSaveProductImage } from "../src/lib/images";
import crypto from "node:crypto";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Début de l'initialisation des données Hit Tech...");

  // 1. Paramètres de la boutique
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Hit Tech",
      contactEmail: "contact@hittech.ma",
      contactPhone: "+212 5 22 20 30 40",
      whatsapp: "+212 6 61 23 45 67",
      address: "142 Boulevard d'Anfa, Quartier Gautier",
      city: "Casablanca",
      openingHours: "Lundi - Samedi : 09h30 - 20h00 (Vendredi pause 12h30 - 15h00)",
      freeShippingThreshold: 50000, // 500 DH gratuité
      codEnabled: true,
      codMaxAmount: 1500000, // 15 000 DH max en COD
      returnDays: 7,
    },
  });

  // 2. Villes de livraison au Maroc
  const citiesData = [
    {
      name: "Casablanca",
      slug: "casablanca",
      region: "Casablanca-Settat",
      fee: 2500, // 25 DH
      minDays: 1,
      maxDays: 1,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Livraison express à domicile le jour même ou en 24h sur Casablanca (Maârif, Gautier, Ain Diab, Sidi Maârouf, Bourgogne, California, etc.). Retrait gratuit possible dans notre boutique boulevard d'Anfa. Paiement en espèces à la livraison ou par carte bancaire.",
    },
    {
      name: "Rabat",
      slug: "rabat",
      region: "Rabat-Salé-Kénitra",
      fee: 3500, // 35 DH
      minDays: 1,
      maxDays: 2,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Livraison rapide en 24h à 48h à Rabat, Salé, Temara et Harhoura. Tous nos produits sont expédiés avec emballage scellé d'origine et garantie officielle marocaine. Suivi de colis en direct.",
    },
    {
      name: "Marrakech",
      slug: "marrakech",
      region: "Marrakech-Safi",
      fee: 3500,
      minDays: 2,
      maxDays: 3,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Livraison sécurisée à Marrakech (Guéliz, Hivernage, Palmeraie, Daoudiate) en 48h à 72h ouvrées. Paiement en espèces au livreur après inspection du colis.",
    },
    {
      name: "Tanger",
      slug: "tanger",
      region: "Tanger-Tétouan-Al Hoceïma",
      fee: 3500,
      minDays: 2,
      maxDays: 3,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Expédition express vers Tanger et la zone franche. Produits neufs sous blister avec facture et garantie constructeur. Possibilité de payer à la livraison.",
    },
    {
      name: "Fès",
      slug: "fes",
      region: "Fès-Meknès",
      fee: 3500,
      minDays: 2,
      maxDays: 3,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Livraison à Fès et région en 48h à 72h. Nos conseillers sont à votre disposition par WhatsApp pour le suivi et le conseil avant achat.",
    },
    {
      name: "Agadir",
      slug: "agadir",
      region: "Souss-Massa",
      fee: 4000,
      minDays: 2,
      maxDays: 4,
      codAvailable: true,
      hasLocalPage: true,
      localContent:
        "Livraison à Agadir, Inezgane et Taghazout. Colis renforcé et assurance transport comprise pour tous les smartphones et PC portables.",
    },
    {
      name: "Meknès",
      slug: "meknes",
      region: "Fès-Meknès",
      fee: 3500,
      minDays: 2,
      maxDays: 3,
      codAvailable: true,
      hasLocalPage: false,
    },
    {
      name: "Oujda",
      slug: "oujda",
      region: "Oriental",
      fee: 4500,
      minDays: 3,
      maxDays: 5,
      codAvailable: true,
      hasLocalPage: false,
    },
    {
      name: "Toutes autres villes du Maroc",
      slug: "maroc-autre",
      region: "National",
      fee: 4500,
      minDays: 3,
      maxDays: 5,
      codAvailable: true,
      hasLocalPage: false,
    },
  ];

  for (const c of citiesData) {
    await prisma.shippingCity.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // 3. Utilisateurs : Admin & Client démo
  const adminPasswordHash = await hash(process.env.SEED_ADMIN_PASSWORD || "ChangezMoi!2026", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const adminUser = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@hittech.ma" },
    update: { passwordHash: adminPasswordHash, role: Role.ADMIN },
    create: {
      email: process.env.SEED_ADMIN_EMAIL || "admin@hittech.ma",
      passwordHash: adminPasswordHash,
      firstName: "Yassine",
      lastName: "El Mansouri",
      phone: "+212 6 61 23 45 67",
      role: Role.ADMIN,
    },
  });

  const customerPasswordHash = await hash("Client2026!", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: "client@hittech.ma" },
    update: { passwordHash: customerPasswordHash },
    create: {
      email: "client@hittech.ma",
      passwordHash: customerPasswordHash,
      firstName: "Salma",
      lastName: "Bennani",
      phone: "+212 6 62 11 22 33",
      role: Role.CUSTOMER,
      addresses: {
        create: {
          label: "Domicile",
          fullName: "Salma Bennani",
          phone: "+212 6 62 11 22 33",
          line1: "Résidence Les Iris, Apt 14",
          line2: "Quartier Maârif",
          city: "Casablanca",
          postalCode: "20100",
          country: "MA",
          isDefault: true,
        },
      },
    },
  });

  // 4. Marques
  const brandsData = [
    { name: "Apple", slug: "apple", description: "iPhone, MacBook, iPad et accessoires officiels." },
    { name: "Samsung", slug: "samsung", description: "Smartphones Galaxy, tablettes et montres connectées." },
    { name: "Xiaomi", slug: "xiaomi", description: "Le meilleur rapport qualité/prix tech au Maroc." },
    { name: "Lenovo", slug: "lenovo", description: "PC portables ThinkPad, IdeaPad et gaming Legion." },
    { name: "Sony", slug: "sony", description: "Casques audio premium antibruit et écouteurs sans fil." },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
    brandMap.set(b.slug, created.id);
  }

  // 5. Catégories
  const categoriesData = [
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Découvrez notre sélection de smartphones neufs avec garantie officielle au Maroc.",
      content:
        "Hit Tech vous propose les derniers smartphones Apple iPhone, Samsung Galaxy et Xiaomi au meilleur prix au Maroc. Tous nos téléphones sont garantis, compatibles avec les réseaux 4G/5G marocains (Maroc Telecom, Inwi, Orange) et livrés sous emballage scellé avec chargeur certifié.",
      seoTitle: "Smartphones Prix Maroc | Acheter Téléphone Portable Garanti | Hit Tech",
      seoDescription: "Achetez votre smartphone au meilleur prix au Maroc : iPhone, Samsung Galaxy, Xiaomi. Livraison express 24h à Casablanca, Rabat et partout au Maroc.",
      featured: true,
      position: 1,
    },
    {
      name: "PC Portables",
      slug: "pc-portables",
      description: "Laptops professionnels, ultrabooks ultra-fins et PC portables gamer puissants.",
      content:
        "Trouvez le PC portable adapté à vos besoins : MacBook pour les créatifs, ThinkPad et IdeaPad pour le travail et les études, ou PC Gamer haute performance avec cartes graphiques RTX. Claviers AZERTY français d'origine, garantie constructeur 12 à 24 mois.",
      seoTitle: "PC Portable Prix Maroc | Laptops Gamer & Bureautique | Hit Tech",
      seoDescription: "Grand choix de PC portables au Maroc : MacBook, Lenovo, gaming RTX. Clavier AZERTY, garantie constructeur et livraison rapide dans tout le Maroc.",
      featured: true,
      position: 2,
    },
    {
      name: "Tablettes",
      slug: "tablettes",
      description: "iPad et tablettes tactiles Android pour la productivité, le dessin et le multimédia.",
      content:
        "Sélection de tablettes tactiles idéales pour les étudiants, les professionnels et la famille. Compatible stylet et clavier pour booster votre productivité au quotidien.",
      seoTitle: "Tablette Tactile & iPad Prix Maroc | Hit Tech",
      seoDescription: "Achetez votre tablette tactile au Maroc : Apple iPad, tablettes Samsung et Android. Prix compétitifs et paiement à la livraison.",
      featured: true,
      position: 3,
    },
    {
      name: "Audio & Casques",
      slug: "audio-casques",
      description: "Casques antibruit actif, écouteurs sans fil et enceintes Bluetooth haute fidélité.",
      content:
        "Profitez d'un son exceptionnel avec notre sélection audio : casques à réduction de bruit Sony, écouteurs True Wireless et enceintes portables étanches pour vos déplacements.",
      seoTitle: "Casques Bluetooth & Écouteurs sans fil Prix Maroc | Hit Tech",
      seoDescription: "Casques audio antibruit, AirPods et écouteurs sans fil au Maroc. Son haute qualité, réduction de bruit active, livraison à domicile.",
      featured: true,
      position: 4,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 6. Traitement des images produits depuis prisma/seed-assets
  const seedAssetsDir = path.resolve("./prisma/seed-assets");
  const processedImages = new Map<string, any>();

  const imageFiles = [
    "phone_s24.jpg",
    "phone_a55.jpg",
    "phone_iphone15.jpg",
    "phone_redmi.jpg",
    "laptop_air.jpg",
    "laptop_gaming.jpg",
    "laptop_ideapad.jpg",
    "tablet_ipad.jpg",
    "tablet_android.jpg",
    "headphones_anc.jpg",
    "headphones_blue.jpg",
    "earbuds_white.jpg",
  ];

  for (const f of imageFiles) {
    try {
      const filePath = path.join(seedAssetsDir, f);
      const buffer = await fs.readFile(filePath);
      const baseName = f.replace(".jpg", "");
      const processed = await processAndSaveProductImage(buffer, baseName);
      processedImages.set(baseName, processed);
      console.log(`  ✓ Image optimisée : ${f} -> WebP multi-résolutions`);
    } catch (e: any) {
      console.warn(`  ! Image non trouvée ou erreur : ${f}`, e?.message);
    }
  }

  // 7. Produits
  const productsData = [
    {
      name: "Samsung Galaxy S24 5G 256 Go Onyx Black",
      slug: "samsung-galaxy-s24-5g-256go-onyx-black",
      sku: "SAM-S24-256-BLK",
      shortDescription: "Écran Dynamic AMOLED 2X 6,2\", Snapdragon 8 Gen 3, triple capteur 50 MP, Galaxy AI intégré.",
      description:
        "Le Samsung Galaxy S24 redéfinit le smartphone haut de gamme avec ses fonctionnalités Galaxy AI révolutionnaires : traduction instantanée d'appels, retouche photo intelligente et recherche entourée d'un geste.\n\nSon écran Dynamic AMOLED 2X 120 Hz offre une lisibilité parfaite même sous le soleil marocain, tandis que son châssis Armor Aluminum garantit une robustesse à toute épreuve.\n\nLivré avec câble USB-C vers USB-C, outil d'éjection SIM et garantie constructeur 12 mois Maroc.",
      price: 899000, // 8 990 DH
      compareAtPrice: 999000, // 9 990 DH
      stock: 14,
      featured: true,
      isNew: true,
      salesCount: 48,
      ratingAvg: 4.8,
      ratingCount: 19,
      warrantyMonths: 12,
      categorySlug: "smartphones",
      brandSlug: "samsung",
      imageKey: "phone_s24",
      specs: [
        { label: "Écran", value: "6,2 pouces Dynamic AMOLED 2X (2340 x 1080), 120 Hz adaptatif" },
        { label: "Processeur", value: "Exynos 2400 / Snapdragon 8 Gen 3 (selon arrivage officiel)" },
        { label: "Stockage", value: "256 Go UFS 4.0" },
        { label: "RAM", value: "8 Go LPDDR5X" },
        { label: "Appareil photo", value: "50 MP grand-angle + 12 MP ultra grand-angle + 10 MP téléobjectif 3x" },
        { label: "Batterie", value: "4 000 mAh avec charge rapide 25W" },
        { label: "Réseau", value: "5G, Dual SIM (nano-SIM + eSIM)" },
        { label: "Étanchéité", value: "Certifié IP68" },
      ],
      seoTitle: "Samsung Galaxy S24 Prix Maroc | Hit Tech Casablanca & Livraison Nationale",
      seoDescription:
        "Achetez le Samsung Galaxy S24 256 Go au meilleur prix au Maroc. Garantie officielle 12 mois, livraison express à Casablanca, Rabat et partout au Maroc.",
    },
    {
      name: "Apple iPhone 15 128 Go Rose Pastel",
      slug: "apple-iphone-15-128go-rose-pastel",
      sku: "APL-IP15-128-PNK",
      shortDescription: "Dynamic Island, appareil photo principal 48 MP, puce A16 Bionic et connecteur USB-C.",
      description:
        "L'iPhone 15 adopte la Dynamic Island pour des notifications interactives sans interrompre ce que vous faites. Son tout nouveau capteur principal de 48 MP capture des détails saisissants avec téléobjectif 2x de qualité optique.\n\nLe dos en verre teinté dans la masse et les contours profilés en aluminium procurent une prise en main douce et élégante. Port USB-C universel pour recharger avec le même câble votre Mac ou iPad.",
      price: 949000, // 9 490 DH
      compareAtPrice: 1049000,
      stock: 9,
      featured: true,
      isNew: true,
      salesCount: 62,
      ratingAvg: 4.9,
      ratingCount: 27,
      warrantyMonths: 12,
      categorySlug: "smartphones",
      brandSlug: "apple",
      imageKey: "phone_iphone15",
      specs: [
        { label: "Écran", value: "Super Retina XDR OLED 6,1\", 2556 x 1179 pixels à 460 ppp" },
        { label: "Puce", value: "Puce A16 Bionic avec GPU 5 cœurs" },
        { label: "Stockage", value: "128 Go" },
        { label: "Photo", value: "Objectif principal 48 MP + Ultra grand-angle 12 MP" },
        { label: "Connectique", value: "USB-C avec prise en charge de la recharge" },
        { label: "Sécurité", value: "Face ID" },
        { label: "Résistance", value: "IP68 (jusqu'à 6 mètres pendant 30 minutes)" },
      ],
      seoTitle: "iPhone 15 Prix Maroc | Hit Tech Boutique Officielle Tech",
      seoDescription:
        "Apple iPhone 15 neuf sous emballage d'origine. Prix compétitif au Maroc avec garantie 1 an et facilités de paiement à la livraison.",
    },
    {
      name: "Samsung Galaxy A55 5G 128 Go Bleu Nuit",
      slug: "samsung-galaxy-a55-5g-128go-bleu-nuit",
      sku: "SAM-A55-128-BLU",
      shortDescription: "Châssis en métal premium, écran Super AMOLED 120 Hz, batterie longue durée 5 000 mAh.",
      description:
        "Le Galaxy A55 5G propose un design premium avec cadre métallique et dos en verre Gorilla Glass Victus+. Son capteur 50 MP stabilisé optiquement assure des clichés nets de jour comme de nuit.\n\nAvec sa batterie de 5 000 mAh offrant jusqu'à deux jours d'autonomie et ses 4 ans de mises à jour Android garanties, c'est le smartphone milieu de gamme le plus recommandé au Maroc.",
      price: 369000, // 3 690 DH
      compareAtPrice: 419000,
      stock: 22,
      featured: true,
      isNew: false,
      salesCount: 84,
      ratingAvg: 4.7,
      ratingCount: 35,
      warrantyMonths: 12,
      categorySlug: "smartphones",
      brandSlug: "samsung",
      imageKey: "phone_a55",
      specs: [
        { label: "Écran", value: "6,6 pouces Super AMOLED FHD+ 120 Hz, 1000 nits" },
        { label: "Processeur", value: "Exynos 1480 Octa-core avec GPU AMD Xclipse" },
        { label: "Mémoire", value: "8 Go RAM / 128 Go stockage (extensible microSD)" },
        { label: "Photo", value: "50 MP OIS + 12 MP grand-angle + 5 MP macro" },
        { label: "Batterie", value: "5 000 mAh charge 25W" },
        { label: "Sécurité", value: "Samsung Knox Vault, lecteur d'empreinte sous l'écran" },
      ],
      seoTitle: "Samsung Galaxy A55 Prix Maroc | Meilleur Milieu de Gamme | Hit Tech",
      seoDescription:
        "Commandez le Galaxy A55 5G au Maroc au meilleur prix. Livraison gratuite dès 500 DH à Casablanca, Rabat, Marrakech et tout le Maroc.",
    },
    {
      name: "Xiaomi Redmi Note 13 Pro 4G 256 Go Violet Aurore",
      slug: "xiaomi-redmi-note-13-pro-256go-violet",
      sku: "XIA-RN13P-256-PUR",
      shortDescription: "Appareil photo ultra-net 200 MP avec OIS, écran AMOLED 120 Hz et charge turbo 67W.",
      description:
        "Le Redmi Note 13 Pro brise les records avec son capteur photo principal de 200 mégapixels stabilisé, capable de zoomer 4x sans perte de qualité. Son écran AMOLED aux bordures ultra-fines offre 1 300 nits de luminosité.\n\nLa recharge turbo de 67W incluse dans la boîte permet de passer de 0 à 100 % en seulement 45 minutes.",
      price: 279000, // 2 790 DH
      compareAtPrice: 319000,
      stock: 18,
      featured: false,
      isNew: false,
      salesCount: 95,
      ratingAvg: 4.6,
      ratingCount: 42,
      warrantyMonths: 12,
      categorySlug: "smartphones",
      brandSlug: "xiaomi",
      imageKey: "phone_redmi",
      specs: [
        { label: "Écran", value: "6,67 pouces AMOLED 120 Hz FHD+, Dolby Vision" },
        { label: "Appareil photo", value: "200 MP (OIS) + 8 MP ultra grand-angle + 2 MP macro" },
        { label: "Stockage / RAM", value: "256 Go UFS 2.2 / 8 Go RAM (+ 8 Go extension virtuelle)" },
        { label: "Processeur", value: "MediaTek Helio G99-Ultra" },
        { label: "Charge", value: "Batterie 5 000 mAh, chargeur 67W fourni dans la boîte" },
      ],
      seoTitle: "Redmi Note 13 Pro Prix Maroc | Caméra 200 MP | Hit Tech",
      seoDescription:
        "Achetez le Redmi Note 13 Pro 256 Go au Maroc. Rapport qualité/prix imbattable, garantie 1 an, paiement en espèces à la livraison.",
    },
    {
      name: "Apple MacBook Air 13\" M3 256 Go Minuit",
      slug: "apple-macbook-air-13-m3-256go-minuit",
      sku: "APL-MBA13-M3-MID",
      shortDescription: "Puce M3 ultra-rapide, autonomie record jusqu'à 18 heures, écran Liquid Retina 13,6\" et design sans ventilateur.",
      description:
        "Le MacBook Air avec puce M3 est l'ordinateur portable idéal pour les études, le travail et la création. D'une finesse remarquable de 11,3 mm, il fonctionne dans un silence absolu grâce à sa conception sans ventilateur.\n\nClavier Magic Keyboard AZERTY rétroéclairé avec Touch ID, caméra FaceTime HD 1080p et système audio à quatre haut-parleurs avec Audio spatial. Port MagSafe 3 dédié à la recharge.",
      price: 1399000, // 13 990 DH
      compareAtPrice: 1499000,
      stock: 6,
      featured: true,
      isNew: true,
      salesCount: 31,
      ratingAvg: 4.9,
      ratingCount: 14,
      warrantyMonths: 12,
      categorySlug: "pc-portables",
      brandSlug: "apple",
      imageKey: "laptop_air",
      specs: [
        { label: "Écran", value: "13,6 pouces Liquid Retina avec True Tone (2560 x 1664)" },
        { label: "Processeur", value: "Puce Apple M3 (CPU 8 cœurs, GPU 8 cœurs, Neural Engine 16 cœurs)" },
        { label: "Mémoire unifiée", value: "8 Go (ou 16 Go selon variante)" },
        { label: "Stockage", value: "SSD 256 Go" },
        { label: "Clavier", value: "Magic Keyboard AZERTY français avec Touch ID" },
        { label: "Poids", value: "1,24 kg" },
        { label: "Autonomie", value: "Jusqu'à 18 heures de lecture vidéo" },
      ],
      seoTitle: "MacBook Air M3 Prix Maroc | Clavier AZERTY Garanti | Hit Tech",
      seoDescription:
        "Achetez le MacBook Air 13 M3 au Maroc. Clavier français AZERTY, garantie Apple 1 an. Livraison sécurisée à Casablanca, Rabat et partout au Maroc.",
    },
    {
      name: "Lenovo Legion 5 Pro 16\" RTX 4060 Core i7",
      slug: "lenovo-legion-5-pro-16-rtx4060-core-i7",
      sku: "LEN-LEG5P-4060",
      shortDescription: "Intel Core i7-14650HX, NVIDIA GeForce RTX 4060 8 Go 140W, écran 16\" WQXGA 240 Hz.",
      description:
        "Conçu pour les gamers exigeants et les créateurs 3D au Maroc, le Lenovo Legion 5 Pro offre des performances exceptionnelles grâce au processeur Intel Core i7 de 14e génération et à la carte graphique NVIDIA RTX 4060 au TGP maximal de 140W.\n\nSon système de refroidissement Legion ColdFront 5.0 maintient les composants au frais même pendant les sessions intenses.",
      price: 1649000, // 16 490 DH
      compareAtPrice: 1799000,
      stock: 4,
      featured: true,
      isNew: true,
      salesCount: 18,
      ratingAvg: 4.9,
      ratingCount: 11,
      warrantyMonths: 24,
      categorySlug: "pc-portables",
      brandSlug: "lenovo",
      imageKey: "laptop_gaming",
      specs: [
        { label: "Écran", value: "16\" WQXGA (2560x1600) IPS 240 Hz, 500 nits, 100% sRGB, G-SYNC" },
        { label: "Processeur", value: "Intel Core i7-14650HX (16 cœurs / 24 threads jusqu'à 5,2 GHz)" },
        { label: "Carte graphique", value: "NVIDIA GeForce RTX 4060 8 Go GDDR6 (140W TGP)" },
        { label: "Mémoire", value: "16 Go DDR5 5600 MHz (extensible à 64 Go)" },
        { label: "Stockage", value: "1 To SSD M.2 PCIe 4.0 NVMe" },
        { label: "Clavier", value: "AZERTY rétroéclairé RGB 4 zones Legion TrueStrike" },
      ],
      seoTitle: "PC Gamer Lenovo Legion 5 Pro Prix Maroc | RTX 4060 | Hit Tech",
      seoDescription:
        "PC portable gamer Lenovo Legion 5 Pro RTX 4060 au Maroc. Garantie 2 ans, stock disponible, livraison express à Casablanca, Marrakech et tout le Maroc.",
    },
    {
      name: "Lenovo IdeaPad Slim 3 15,6\" Ryzen 5 16 Go RAM",
      slug: "lenovo-ideapad-slim-3-15-ryzen5-16go",
      sku: "LEN-IPS3-R5-16G",
      shortDescription: "AMD Ryzen 5 7530U, 16 Go de RAM, SSD 512 Go, écran FHD antireflet 15,6\".",
      description:
        "L'IdeaPad Slim 3 est le PC portable bureautique par excellence pour les étudiants, enseignants et télétravailleurs au Maroc. Équipé d'un puissant processeur AMD Ryzen 5 à 6 cœurs et de 16 Go de RAM, il gère sans ralentissement le multitâche, les réunions en ligne et les tableurs volumineux.",
      price: 549000, // 5 490 DH
      compareAtPrice: 599000,
      stock: 12,
      featured: false,
      isNew: false,
      salesCount: 52,
      ratingAvg: 4.6,
      ratingCount: 22,
      warrantyMonths: 12,
      categorySlug: "pc-portables",
      brandSlug: "lenovo",
      imageKey: "laptop_ideapad",
      specs: [
        { label: "Écran", value: "15,6 pouces Full HD (1920x1080) antireflet" },
        { label: "Processeur", value: "AMD Ryzen 5 7530U (6 cœurs, 12 threads)" },
        { label: "RAM", value: "16 Go DDR4" },
        { label: "Stockage", value: "SSD NVMe 512 Go" },
        { label: "Clavier", value: "AZERTY avec pavé numérique dédié" },
        { label: "Poids", value: "1,62 kg" },
      ],
      seoTitle: "Lenovo IdeaPad Slim 3 Prix Maroc | PC Portable Étudiant & Pro | Hit Tech",
      seoDescription:
        "PC portable Lenovo IdeaPad Slim 3 16 Go RAM au Maroc. Idéal études et travail. Clavier AZERTY, livraison rapide et paiement à la livraison.",
    },
    {
      name: "Apple iPad 10e Génération 10,9\" Wi-Fi 64 Go Bleu",
      slug: "apple-ipad-10-generation-wifi-64go-bleu",
      sku: "APL-IPAD10-64-BLU",
      shortDescription: "Écran Liquid Retina 10,9\", puce A14 Bionic, port USB-C et caméra frontale cadrée au centre.",
      description:
        "L'iPad 10 séduit avec son design tout écran aux couleurs vives. La puce A14 Bionic apporte puissance et fluidité pour monter des vidéos 4K, jouer à des jeux exigeants ou prendre des notes avec l'Apple Pencil.\n\nCaméra frontale ultra grand-angle 12 MP en paysage avec Cadre centré pour des appels vidéo naturels avec vos proches ou collègues.",
      price: 499000, // 4 990 DH
      compareAtPrice: 549000,
      stock: 15,
      featured: true,
      isNew: false,
      salesCount: 41,
      ratingAvg: 4.8,
      ratingCount: 16,
      warrantyMonths: 12,
      categorySlug: "tablettes",
      brandSlug: "apple",
      imageKey: "tablet_ipad",
      specs: [
        { label: "Écran", value: "Liquid Retina 10,9 pouces avec True Tone (2360 x 1640)" },
        { label: "Puce", value: "A14 Bionic avec Neural Engine" },
        { label: "Stockage", value: "64 Go" },
        { label: "Caméras", value: "Arrière 12 MP grand-angle / Avant 12 MP ultra grand-angle paysage" },
        { label: "Connectique", value: "Port USB-C" },
        { label: "Compatibilité", value: "Apple Pencil (USB-C) et Magic Keyboard Folio" },
      ],
      seoTitle: "Apple iPad 10 Prix Maroc | Tablette Tactile Garantie | Hit Tech",
      seoDescription:
        "Commandez votre iPad 10e génération au meilleur prix au Maroc. Garantie 1 an, livraison à domicile à Casablanca, Rabat et toutes les villes marocaines.",
    },
    {
      name: "Samsung Galaxy Tab A9+ 11\" Wi-Fi 64 Go Graphite",
      slug: "samsung-galaxy-tab-a9-plus-64go-graphite",
      sku: "SAM-TABA9P-64-GRP",
      shortDescription: "Grand écran 11\" fluide 90 Hz, son 3D surround à 4 haut-parleurs, mode multitâche 3 applications.",
      description:
        "La Galaxy Tab A9+ offre un écran immersif de 11 pouces avec taux de rafraîchissement de 90 Hz pour un défilement ultra-fluide. Ses 4 haut-parleurs compatibles Dolby Atmos transforment vos séances films et séries en véritable expérience cinéma.",
      price: 229000, // 2 290 DH
      compareAtPrice: 259000,
      stock: 19,
      featured: false,
      isNew: false,
      salesCount: 38,
      ratingAvg: 4.5,
      ratingCount: 17,
      warrantyMonths: 12,
      categorySlug: "tablettes",
      brandSlug: "samsung",
      imageKey: "tablet_android",
      specs: [
        { label: "Écran", value: "11,0 pouces WQXGA (1920 x 1200) 90 Hz" },
        { label: "Audio", value: "4 haut-parleurs compatibles Dolby Atmos" },
        { label: "Processeur", value: "Snapdragon 695 5G Octa-core" },
        { label: "Mémoire", value: "4 Go RAM / 64 Go (microSD jusqu'à 1 To)" },
        { label: "Batterie", value: "7 040 mAh charge rapide 15W" },
      ],
      seoTitle: "Samsung Galaxy Tab A9+ Prix Maroc | Tablette Familiale | Hit Tech",
      seoDescription:
        "Achetez la tablette Samsung Tab A9+ 11 pouces au Maroc. Idéale pour enfants et famille. Paiement en espèces au livreur.",
    },
    {
      name: "Sony WH-1000XM5 Casque Bluetooth Antibruit Noir",
      slug: "sony-wh-1000xm5-casque-antibruit-noir",
      sku: "SNY-WH1000XM5-BLK",
      shortDescription: "La référence mondiale de la réduction de bruit active, son Hi-Res sans fil LDAC, 30h d'autonomie.",
      description:
        "Le Sony WH-1000XM5 isole parfaitement du bruit ambiant (avion, train, open-space, café) grâce à ses deux processeurs et ses huit microphones dédiés. Le nouveau diaphragme de 30 mm offre un son haute résolution cristallin et des basses percutantes.\n\nAutonomie record de 30 heures avec réduction de bruit activée, et 3 minutes de charge rapide redonnent 3 heures d'écoute. Fonction Speak-to-Chat et connexion multipoint avec deux appareils simultanément.",
      price: 389000, // 3 890 DH
      compareAtPrice: 429000,
      stock: 8,
      featured: true,
      isNew: true,
      salesCount: 56,
      ratingAvg: 4.9,
      ratingCount: 29,
      warrantyMonths: 12,
      categorySlug: "audio-casques",
      brandSlug: "sony",
      imageKey: "headphones_anc",
      specs: [
        { label: "Réduction de bruit", value: "Technologie ANC avec processeurs QN1 et V1 intégrés" },
        { label: "Autonomie", value: "Jusqu'à 30h avec ANC, 40h sans ANC" },
        { label: "Codecs audio", value: "LDAC, AAC, SBC (Hi-Res Audio Wireless certifié)" },
        { label: "Poids", value: "250 g, design ultra-confortable" },
        { label: "Connectivité", value: "Bluetooth 5.2 multipoint, prise jack 3,5 mm incluse" },
      ],
      seoTitle: "Casque Sony WH-1000XM5 Prix Maroc | Meilleur Casque Antibruit | Hit Tech",
      seoDescription:
        "Le casque sans fil Sony WH-1000XM5 au Maroc au meilleur prix garanti. Réduction de bruit active imbattable, livraison 24h à domicile.",
    },
    {
      name: "Sony WH-CH520 Casque sans fil Bleu Céleste",
      slug: "sony-wh-ch520-casque-sans-fil-bleu",
      sku: "SNY-CH520-BLU",
      shortDescription: "Autonomie colossale de 50 heures, technologie DSEE d'optimisation sonore et confort ultra-léger.",
      description:
        "Avec jusqu'à 50 heures d'autonomie sur une seule charge, le Sony WH-CH520 ne vous lâchera jamais pendant la semaine. Son arceau réglable et ses coussinets moelleux garantissent un port agréable toute la journée. Connexion multipoint fluide entre votre smartphone et votre PC.",
      price: 59000, // 590 DH
      compareAtPrice: 69000,
      stock: 25,
      featured: false,
      isNew: false,
      salesCount: 77,
      ratingAvg: 4.7,
      ratingCount: 31,
      warrantyMonths: 12,
      categorySlug: "audio-casques",
      brandSlug: "sony",
      imageKey: "headphones_blue",
      specs: [
        { label: "Autonomie", value: "Jusqu'à 50 heures d'écoute continue" },
        { label: "Charge", value: "Charge rapide USB-C (3 min = 1h30 d'écoute)" },
        { label: "Poids", value: "Seulement 147 grammes" },
        { label: "Connexion", value: "Bluetooth 5.2 avec connexion multipoint" },
      ],
      seoTitle: "Sony WH-CH520 Prix Maroc | Casque Bluetooth 50h d'Autonomie | Hit Tech",
      seoDescription:
        "Casque Bluetooth Sony WH-CH520 pas cher au Maroc. 50h d'autonomie, son de qualité et livraison rapide chez vous.",
    },
    {
      name: "Écouteurs sans fil Pro ANC Blanc Brillant",
      slug: "ecouteurs-sans-fil-pro-anc-blanc",
      sku: "HT-EARPRO-WHT",
      shortDescription: "Réduction active du bruit, mode transparence, boîtier de charge sans fil et autonomie 24h.",
      description:
        "Ces écouteurs True Wireless allient un design ergonomique discret à une réduction active du bruit efficace pour vos trajets et appels quotidiens. Équipés de microphones avec réduction de bruit du vent, vos interlocuteurs vous entendent clairement même dans la rue.\n\nBoîtier compact rechargeable par USB-C ou induction sans fil Qi.",
      price: 89000, // 890 DH
      compareAtPrice: 119000,
      stock: 30,
      featured: false,
      isNew: true,
      salesCount: 68,
      ratingAvg: 4.6,
      ratingCount: 25,
      warrantyMonths: 12,
      categorySlug: "audio-casques",
      brandSlug: "apple",
      imageKey: "earbuds_white",
      specs: [
        { label: "Isolation", value: "Réduction active du bruit (ANC) + Mode Transparence" },
        { label: "Autonomie", value: "6h par charge, jusqu'à 24h avec le boîtier" },
        { label: "Recharge", value: "USB-C et charge sans fil Qi" },
        { label: "Résistance", value: "IPX4 résistant à la sueur et aux éclaboussures" },
      ],
      seoTitle: "Écouteurs sans fil Bluetooth Prix Maroc | Réduction de Bruit | Hit Tech",
      seoDescription:
        "Écouteurs True Wireless avec réduction de bruit active au Maroc. Boîtier de charge sans fil, livraison express et paiement à la livraison.",
    },
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug)!;
    const brandId = p.brandSlug ? brandMap.get(p.brandSlug) : undefined;
    const imgInfo = processedImages.get(p.imageKey);

    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        featured: p.featured,
        isNew: p.isNew,
        salesCount: p.salesCount,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        warrantyMonths: p.warrantyMonths,
        categoryId,
        brandId,
        specs: p.specs,
        status: ProductStatus.PUBLISHED,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: new Date(),
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        featured: p.featured,
        isNew: p.isNew,
        salesCount: p.salesCount,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        warrantyMonths: p.warrantyMonths,
        categoryId,
        brandId,
        specs: p.specs,
        status: ProductStatus.PUBLISHED,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: new Date(),
        images: imgInfo
          ? {
              create: [
                {
                  url: imgInfo.url,
                  mediumUrl: imgInfo.mediumUrl,
                  thumbUrl: imgInfo.thumbUrl,
                  width: imgInfo.width,
                  height: imgInfo.height,
                  alt: p.name,
                  position: 0,
                },
              ],
            }
          : undefined,
      },
      include: { images: true },
    });

    createdProducts.push(created);
    console.log(`  ✓ Produit créé : ${created.name}`);
  }

  // 8. Avis clients réalistes (marocains)
  const reviewsSeed = [
    {
      productSlug: "samsung-galaxy-s24-5g-256go-onyx-black",
      rating: 5,
      title: "Excellent téléphone, livraison très rapide à Casa !",
      body: "Commandé à midi, reçu le lendemain matin à Bourgogne Casablanca. Produit scellé 100% original avec facture et garantie officielle. L'IA de Samsung pour la traduction en direct est bluffante. Très satisfait de Hit Tech !",
      userName: "Mehdi K.",
    },
    {
      productSlug: "samsung-galaxy-s24-5g-256go-onyx-black",
      rating: 5,
      title: "Super service client par WhatsApp",
      body: "J'avais une hésitation entre le S24 et l'iPhone 15, le conseiller WhatsApp m'a bien orienté. Téléphone très fluide, photos magnifiques de nuit.",
      userName: "Nadia T.",
    },
    {
      productSlug: "apple-iphone-15-128go-rose-pastel",
      rating: 5,
      title: "Top ! Couleur rose magnifique",
      body: "La couleur est encore plus belle en vrai que sur les photos. Dynamic Island très pratique au quotidien. Colis très bien protégé pour la livraison à Rabat.",
      userName: "Kawtar E.",
    },
    {
      productSlug: "sony-wh-1000XM5-casque-antibruit-noir".toLowerCase(),
      rating: 5,
      title: "La meilleure réduction de bruit",
      body: "Je l'utilise pour le télétravail et les voyages. Le silence est immédiat dès qu'on l'allume. Le son est d'une grande clarté. Vaut largement son prix.",
      userName: "Omar B.",
    },
    {
      productSlug: "samsung-galaxy-a55-5g-128go-bleu-nuit",
      rating: 4,
      title: "Très bon rapport qualité prix",
      body: "Design soigné avec cadre en alu qui fait très premium. Batterie qui tient facilement 2 jours d'utilisation normale. Seul bémol : le chargeur n'est plus fourni dans la boîte par Samsung.",
      userName: "Anas L.",
    },
  ];

  for (const r of reviewsSeed) {
    const prod = createdProducts.find((p) => p.slug.toLowerCase() === r.productSlug.toLowerCase());
    if (prod) {
      // Utilisateur de démo ou utilisateur dédié
      await prisma.review.upsert({
        where: {
          productId_userId: {
            productId: prod.id,
            userId: demoCustomer.id,
          },
        },
        update: {
          rating: r.rating,
          title: r.title,
          body: r.body,
          status: ReviewStatus.APPROVED,
          verifiedPurchase: true,
        },
        create: {
          productId: prod.id,
          userId: demoCustomer.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          status: ReviewStatus.APPROVED,
          verifiedPurchase: true,
        },
      });
    }
  }

  // 9. Codes promotionnels
  await prisma.discountCode.upsert({
    where: { code: "HITTECH10" },
    update: {},
    create: {
      code: "HITTECH10",
      description: "10% de réduction sur toute la boutique dès 300 DH d'achat",
      type: "PERCENT",
      value: 10,
      minSubtotal: 30000, // 300 DH
      isActive: true,
    },
  });

  await prisma.discountCode.upsert({
    where: { code: "BIENVENUE" },
    update: {},
    create: {
      code: "BIENVENUE",
      description: "50 DH de réduction pour votre première commande dès 250 DH",
      type: "FIXED",
      value: 5000, // 50 DH
      minSubtotal: 25000,
      isActive: true,
    },
  });

  // 10. Commandes de démonstration (pour peupler le tableau de bord admin et les statistiques)
  const existingOrdersCount = await prisma.order.count();
  if (existingOrdersCount === 0 && createdProducts.length >= 3) {
    const p1 = createdProducts[0];
    const p2 = createdProducts[2];
    const p3 = createdProducts[9] ?? createdProducts[1];

    // Commande 1 : Livrée
    const token1 = crypto.randomBytes(32).toString("hex");
    const tokenHash1 = crypto.createHash("sha256").update(token1).digest("hex");
    await prisma.order.create({
      data: {
        number: "HT-2026-0001",
        accessTokenHash: tokenHash1,
        userId: demoCustomer.id,
        email: demoCustomer.email,
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PAID,
        subtotal: p2.price,
        shippingFee: 0,
        total: p2.price,
        shipFullName: "Salma Bennani",
        shipPhone: "+212 6 62 11 22 33",
        shipLine1: "Résidence Les Iris, Apt 14",
        shipCity: "Casablanca",
        shipPostalCode: "20100",
        trackingNumber: "AMN-77492-MA",
        carrier: "Amana Express",
        deliveryEstimate: "1 jour",
        items: {
          create: [
            {
              productId: p2.id,
              productName: p2.name,
              productSlug: p2.slug,
              sku: p2.sku,
              imageUrl: p2.images[0]?.thumbUrl ?? null,
              unitPrice: p2.price,
              quantity: 1,
              lineTotal: p2.price,
            },
          ],
        },
        history: {
          create: [
            { status: OrderStatus.CONFIRMED, note: "Commande validée par téléphone" },
            { status: OrderStatus.PROCESSING, note: "Colis préparé au dépôt d'Anfa" },
            { status: OrderStatus.SHIPPED, note: "Pris en charge par le livreur" },
            { status: OrderStatus.DELIVERED, note: "Livrée et encaissée en espèces" },
          ],
        },
      },
    });

    // Commande 2 : En cours de traitement
    const token2 = crypto.randomBytes(32).toString("hex");
    const tokenHash2 = crypto.createHash("sha256").update(token2).digest("hex");
    await prisma.order.create({
      data: {
        number: "HT-2026-0002",
        accessTokenHash: tokenHash2,
        email: "karim.tazi@gmail.com",
        status: OrderStatus.PROCESSING,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.UNPAID,
        subtotal: p1.price + (p3 ? p3.price : 0),
        shippingFee: 0,
        total: p1.price + (p3 ? p3.price : 0),
        shipFullName: "Karim Tazi",
        shipPhone: "+212 6 61 99 88 77",
        shipLine1: "Avenue Annakhil, Secteur 10",
        shipCity: "Rabat",
        shipPostalCode: "10000",
        deliveryEstimate: "1-2 jours",
        items: {
          create: [
            {
              productId: p1.id,
              productName: p1.name,
              productSlug: p1.slug,
              sku: p1.sku,
              imageUrl: p1.images[0]?.thumbUrl ?? null,
              unitPrice: p1.price,
              quantity: 1,
              lineTotal: p1.price,
            },
            ...(p3
              ? [
                  {
                    productId: p3.id,
                    productName: p3.name,
                    productSlug: p3.slug,
                    sku: p3.sku,
                    imageUrl: p3.images[0]?.thumbUrl ?? null,
                    unitPrice: p3.price,
                    quantity: 1,
                    lineTotal: p3.price,
                  },
                ]
              : []),
          ],
        },
        history: {
          create: [
            { status: OrderStatus.CONFIRMED, note: "Client confirmé par téléphone" },
            { status: OrderStatus.PROCESSING, note: "En cours d'emballage" },
          ],
        },
      },
    });
  }

  console.log("✅ Données Hit Tech initialisées avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
