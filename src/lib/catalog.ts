import { prisma, ProductStatus } from "@/lib/prisma";
import { type ProductCardData } from "@/components/ProductCard";

export interface CatalogProduct extends ProductCardData {
  shortDescription?: string;
  description?: string;
  warrantyMonths?: number | null;
  sku: string;
  specs?: Array<{ label: string; value: string }>;
  salesCount?: number;
  category?: { name: string; slug: string; id?: string };
  brand?: { name: string; slug?: string; id?: string };
}

// Données de secours fidèles au catalogue officiel Hit Tech Maroc
export const SEED_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-s24",
    name: "Samsung Galaxy S24 5G 256 Go Onyx Black",
    slug: "samsung-galaxy-s24-5g-256go-onyx-black",
    sku: "SAM-S24-256-BLK",
    shortDescription: "Écran Dynamic AMOLED 2X 6,2\", Snapdragon 8 Gen 3, triple capteur 50 MP, Galaxy AI intégré.",
    description:
      "Le Samsung Galaxy S24 redéfinit le smartphone haut de gamme avec ses fonctionnalités Galaxy AI révolutionnaires : traduction instantanée d'appels, retouche photo intelligente et recherche entourée d'un geste.\n\nSon écran Dynamic AMOLED 2X 120 Hz offre une lisibilité parfaite même sous le soleil marocain, tandis que son châssis Armor Aluminum garantit une robustesse à toute épreuve.\n\nLivré avec câble USB-C vers USB-C, outil d'éjection SIM et garantie constructeur 12 mois Maroc.",
    price: 899000,
    compareAtPrice: 999000,
    stock: 14,
    featured: true,
    isNew: true,
    salesCount: 48,
    ratingAvg: 4.8,
    ratingCount: 19,
    warrantyMonths: 12,
    brand: { name: "Samsung", slug: "samsung" },
    category: { name: "Smartphones", slug: "smartphones" },
    images: [
      {
        url: "/media/products/phone_s24-67599269e83ad236ac4dbc11-1200.webp",
        mediumUrl: "/media/products/phone_s24-67599269e83ad236ac4dbc11-640.webp",
        thumbUrl: "/media/products/phone_s24-67599269e83ad236ac4dbc11-160.webp",
        alt: "Samsung Galaxy S24 5G Onyx Black",
      },
    ],
    specs: [
      { label: "Écran", value: "6,2 pouces Dynamic AMOLED 2X (2340 x 1080), 120 Hz adaptatif" },
      { label: "Processeur", value: "Snapdragon 8 Gen 3 / Exynos 2400 officiel" },
      { label: "Stockage", value: "256 Go UFS 4.0" },
      { label: "RAM", value: "8 Go LPDDR5X" },
      { label: "Appareil photo", value: "50 MP grand-angle + 12 MP ultra grand-angle + 10 MP téléobjectif 3x" },
      { label: "Batterie", value: "4 000 mAh avec charge rapide 25W" },
      { label: "Réseau", value: "5G, Dual SIM (nano-SIM + eSIM)" },
      { label: "Étanchéité", value: "Certifié IP68" },
    ],
  },
  {
    id: "prod-ip15",
    name: "Apple iPhone 15 128 Go Rose Pastel",
    slug: "apple-iphone-15-128go-rose-pastel",
    sku: "APL-IP15-128-PNK",
    shortDescription: "Dynamic Island, appareil photo principal 48 MP, puce A16 Bionic et connecteur USB-C.",
    description:
      "L'iPhone 15 adopte la Dynamic Island pour des notifications interactives sans interrompre ce que vous faites. Son tout nouveau capteur principal de 48 MP capture des détails saisissants avec téléobjectif 2x de qualité optique.\n\nLe dos en verre teinté dans la masse et les contours profilés en aluminium procurent une prise en main douce et élégante. Port USB-C universel pour recharger avec le même câble votre Mac ou iPad.",
    price: 949000,
    compareAtPrice: 1049000,
    stock: 9,
    featured: true,
    isNew: true,
    salesCount: 62,
    ratingAvg: 4.9,
    ratingCount: 27,
    warrantyMonths: 12,
    brand: { name: "Apple", slug: "apple" },
    category: { name: "Smartphones", slug: "smartphones" },
    images: [
      {
        url: "/media/products/phone_iphone15-f6cfb227e087a1eb511451a2-1200.webp",
        mediumUrl: "/media/products/phone_iphone15-f6cfb227e087a1eb511451a2-640.webp",
        thumbUrl: "/media/products/phone_iphone15-f6cfb227e087a1eb511451a2-160.webp",
        alt: "Apple iPhone 15 Rose Pastel",
      },
    ],
    specs: [
      { label: "Écran", value: "Super Retina XDR OLED 6,1\", 2556 x 1179 pixels à 460 ppp" },
      { label: "Puce", value: "Puce A16 Bionic avec GPU 5 cœurs" },
      { label: "Stockage", value: "128 Go" },
      { label: "Photo", value: "Objectif principal 48 MP + Ultra grand-angle 12 MP" },
      { label: "Connectique", value: "USB-C avec prise en charge de la recharge" },
      { label: "Sécurité", value: "Face ID" },
      { label: "Résistance", value: "IP68 (jusqu'à 6 mètres pendant 30 minutes)" },
    ],
  },
  {
    id: "prod-a55",
    name: "Samsung Galaxy A55 5G 128 Go Bleu Nuit",
    slug: "samsung-galaxy-a55-5g-128go-bleu-nuit",
    sku: "SAM-A55-128-BLU",
    shortDescription: "Châssis en métal premium, écran Super AMOLED 120 Hz, batterie longue durée 5 000 mAh.",
    description:
      "Le Galaxy A55 5G propose un design premium avec cadre métallique et dos en verre Gorilla Glass Victus+. Son capteur 50 MP stabilisé optiquement assure des clichés nets de jour comme de nuit.\n\nAvec sa batterie de 5 000 mAh offrant jusqu'à deux jours d'autonomie et ses 4 ans de mises à jour Android garanties, c'est le smartphone milieu de gamme le plus recommandé au Maroc.",
    price: 369000,
    compareAtPrice: 419000,
    stock: 22,
    featured: true,
    isNew: false,
    salesCount: 84,
    ratingAvg: 4.7,
    ratingCount: 35,
    warrantyMonths: 12,
    brand: { name: "Samsung", slug: "samsung" },
    category: { name: "Smartphones", slug: "smartphones" },
    images: [
      {
        url: "/media/products/phone_a55-d358b5f6df5700d8b91c7cd1-1200.webp",
        mediumUrl: "/media/products/phone_a55-d358b5f6df5700d8b91c7cd1-640.webp",
        thumbUrl: "/media/products/phone_a55-d358b5f6df5700d8b91c7cd1-160.webp",
        alt: "Samsung Galaxy A55 5G Bleu Nuit",
      },
    ],
    specs: [
      { label: "Écran", value: "6,6 pouces Super AMOLED FHD+ 120 Hz, 1000 nits" },
      { label: "Processeur", value: "Exynos 1480 Octa-core avec GPU AMD Xclipse" },
      { label: "Mémoire", value: "8 Go RAM / 128 Go stockage" },
      { label: "Photo", value: "50 MP OIS + 12 MP grand-angle + 5 MP macro" },
      { label: "Batterie", value: "5 000 mAh charge 25W" },
    ],
  },
  {
    id: "prod-redmi",
    name: "Xiaomi Redmi Note 13 Pro 4G 256 Go Violet Aurore",
    slug: "xiaomi-redmi-note-13-pro-256go-violet",
    sku: "XIA-RN13P-256-PUR",
    shortDescription: "Appareil photo ultra-net 200 MP avec OIS, écran AMOLED 120 Hz et charge turbo 67W.",
    description:
      "Le Redmi Note 13 Pro brise les records avec son capteur photo principal de 200 mégapixels stabilisé, capable de zoomer 4x sans perte de qualité. Son écran AMOLED aux bordures ultra-fines offre 1 300 nits de luminosité.",
    price: 279000,
    compareAtPrice: 319000,
    stock: 18,
    featured: false,
    isNew: false,
    salesCount: 95,
    ratingAvg: 4.6,
    ratingCount: 42,
    warrantyMonths: 12,
    brand: { name: "Xiaomi", slug: "xiaomi" },
    category: { name: "Smartphones", slug: "smartphones" },
    images: [
      {
        url: "/media/products/phone_redmi-eaa42a85aae1b11303bedc4b-1200.webp",
        mediumUrl: "/media/products/phone_redmi-eaa42a85aae1b11303bedc4b-640.webp",
        thumbUrl: "/media/products/phone_redmi-eaa42a85aae1b11303bedc4b-160.webp",
        alt: "Xiaomi Redmi Note 13 Pro Violet",
      },
    ],
    specs: [
      { label: "Écran", value: "6,67 pouces AMOLED 120 Hz FHD+, Dolby Vision" },
      { label: "Appareil photo", value: "200 MP (OIS) + 8 MP ultra grand-angle + 2 MP macro" },
      { label: "Stockage / RAM", value: "256 Go UFS 2.2 / 8 Go RAM" },
      { label: "Charge", value: "Batterie 5 000 mAh, chargeur 67W fourni" },
    ],
  },
  {
    id: "prod-macair",
    name: "Apple MacBook Air 13\" M3 256 Go Minuit",
    slug: "apple-macbook-air-13-m3-256go-minuit",
    sku: "APL-MBA13-M3-MID",
    shortDescription: "Puce M3 ultra-rapide, autonomie record jusqu'à 18 heures, écran Liquid Retina 13,6\".",
    description:
      "Le MacBook Air avec puce M3 est l'ordinateur portable idéal pour les études, le travail et la création. D'une finesse remarquable de 11,3 mm, il fonctionne dans un silence absolu grâce à sa conception sans ventilateur.\n\nClavier Magic Keyboard AZERTY rétroéclairé avec Touch ID.",
    price: 1399000,
    compareAtPrice: 1499000,
    stock: 6,
    featured: true,
    isNew: true,
    salesCount: 31,
    ratingAvg: 4.9,
    ratingCount: 14,
    warrantyMonths: 12,
    brand: { name: "Apple", slug: "apple" },
    category: { name: "PC Portables", slug: "pc-portables" },
    images: [
      {
        url: "/media/products/laptop_air-10c2ff65d854b98941b0c432-1200.webp",
        mediumUrl: "/media/products/laptop_air-10c2ff65d854b98941b0c432-640.webp",
        thumbUrl: "/media/products/laptop_air-10c2ff65d854b98941b0c432-160.webp",
        alt: "Apple MacBook Air 13 M3 Minuit",
      },
    ],
    specs: [
      { label: "Écran", value: "13,6 pouces Liquid Retina avec True Tone (2560 x 1664)" },
      { label: "Processeur", value: "Puce Apple M3 (CPU 8 cœurs, GPU 8 cœurs)" },
      { label: "Mémoire unifiée", value: "8 Go" },
      { label: "Stockage", value: "SSD 256 Go" },
      { label: "Clavier", value: "Magic Keyboard AZERTY français avec Touch ID" },
      { label: "Poids", value: "1,24 kg" },
    ],
  },
  {
    id: "prod-legion",
    name: "Lenovo Legion 5 Pro 16\" RTX 4060 Core i7",
    slug: "lenovo-legion-5-pro-16-rtx4060-core-i7",
    sku: "LEN-LEG5P-4060",
    shortDescription: "Intel Core i7-14650HX, NVIDIA GeForce RTX 4060 8 Go 140W, écran 16\" WQXGA 240 Hz.",
    description:
      "Conçu pour les gamers exigeants et les créateurs 3D au Maroc, le Lenovo Legion 5 Pro offre des performances exceptionnelles grâce au processeur Intel Core i7 de 14e génération et à la carte graphique NVIDIA RTX 4060 au TGP maximal de 140W.",
    price: 1649000,
    compareAtPrice: 1799000,
    stock: 4,
    featured: true,
    isNew: true,
    salesCount: 18,
    ratingAvg: 4.9,
    ratingCount: 11,
    warrantyMonths: 24,
    brand: { name: "Lenovo", slug: "lenovo" },
    category: { name: "PC Portables", slug: "pc-portables" },
    images: [
      {
        url: "/media/products/laptop_gaming-a7179614307d13c1c1c338c6-1200.webp",
        mediumUrl: "/media/products/laptop_gaming-a7179614307d13c1c1c338c6-640.webp",
        thumbUrl: "/media/products/laptop_gaming-a7179614307d13c1c1c338c6-160.webp",
        alt: "Lenovo Legion 5 Pro RTX 4060",
      },
    ],
    specs: [
      { label: "Écran", value: "16\" WQXGA (2560x1600) IPS 240 Hz, 500 nits, G-SYNC" },
      { label: "Processeur", value: "Intel Core i7-14650HX (16 cœurs)" },
      { label: "Carte graphique", value: "NVIDIA GeForce RTX 4060 8 Go GDDR6 (140W TGP)" },
      { label: "Mémoire", value: "16 Go DDR5 5600 MHz" },
      { label: "Stockage", value: "1 To SSD M.2 PCIe 4.0 NVMe" },
    ],
  },
  {
    id: "prod-ideapad",
    name: "Lenovo IdeaPad Slim 3 15,6\" Ryzen 5 16 Go RAM",
    slug: "lenovo-ideapad-slim-3-15-ryzen5-16go",
    sku: "LEN-IPS3-R5-16G",
    shortDescription: "AMD Ryzen 5 7530U, 16 Go de RAM, SSD 512 Go, écran FHD antireflet 15,6\".",
    description:
      "L'IdeaPad Slim 3 est le PC portable bureautique par excellence pour les étudiants, enseignants et télétravailleurs au Maroc. Équipé d'un puissant processeur AMD Ryzen 5 à 6 cœurs et de 16 Go de RAM.",
    price: 549000,
    compareAtPrice: 599000,
    stock: 12,
    featured: false,
    isNew: false,
    salesCount: 52,
    ratingAvg: 4.6,
    ratingCount: 22,
    warrantyMonths: 12,
    brand: { name: "Lenovo", slug: "lenovo" },
    category: { name: "PC Portables", slug: "pc-portables" },
    images: [
      {
        url: "/media/products/laptop_ideapad-51c8584f6421e06721bcddda-1200.webp",
        mediumUrl: "/media/products/laptop_ideapad-51c8584f6421e06721bcddda-640.webp",
        thumbUrl: "/media/products/laptop_ideapad-51c8584f6421e06721bcddda-160.webp",
        alt: "Lenovo IdeaPad Slim 3 15",
      },
    ],
    specs: [
      { label: "Écran", value: "15,6 pouces Full HD (1920x1080) antireflet" },
      { label: "Processeur", value: "AMD Ryzen 5 7530U (6 cœurs)" },
      { label: "RAM", value: "16 Go DDR4" },
      { label: "Stockage", value: "SSD NVMe 512 Go" },
    ],
  },
  {
    id: "prod-ipad10",
    name: "Apple iPad 10e Génération 10,9\" Wi-Fi 64 Go Bleu",
    slug: "apple-ipad-10-generation-wifi-64go-bleu",
    sku: "APL-IPAD10-64-BLU",
    shortDescription: "Écran Liquid Retina 10,9\", puce A14 Bionic, port USB-C et caméra frontale cadrée au centre.",
    description:
      "L'iPad 10 séduit avec son design tout écran aux couleurs vives. La puce A14 Bionic apporte puissance et fluidité pour monter des vidéos 4K, jouer à des jeux exigeants ou prendre des notes avec l'Apple Pencil.",
    price: 499000,
    compareAtPrice: 549000,
    stock: 15,
    featured: true,
    isNew: false,
    salesCount: 41,
    ratingAvg: 4.8,
    ratingCount: 16,
    warrantyMonths: 12,
    brand: { name: "Apple", slug: "apple" },
    category: { name: "Tablettes", slug: "tablettes" },
    images: [
      {
        url: "/media/products/tablet_ipad-9c84fae11ce8cf3a2e787086-1200.webp",
        mediumUrl: "/media/products/tablet_ipad-9c84fae11ce8cf3a2e787086-640.webp",
        thumbUrl: "/media/products/tablet_ipad-9c84fae11ce8cf3a2e787086-160.webp",
        alt: "Apple iPad 10e Génération Bleu",
      },
    ],
    specs: [
      { label: "Écran", value: "Liquid Retina 10,9 pouces avec True Tone (2360 x 1640)" },
      { label: "Puce", value: "A14 Bionic avec Neural Engine" },
      { label: "Stockage", value: "64 Go" },
      { label: "Caméras", value: "12 MP grand-angle arrière / 12 MP ultra grand-angle avant" },
    ],
  },
  {
    id: "prod-taba9",
    name: "Samsung Galaxy Tab A9+ 11\" Wi-Fi 64 Go Graphite",
    slug: "samsung-galaxy-tab-a9-plus-64go-graphite",
    sku: "SAM-TABA9P-64-GRP",
    shortDescription: "Grand écran 11\" fluide 90 Hz, son 3D surround à 4 haut-parleurs, mode multitâche.",
    description:
      "La Galaxy Tab A9+ offre un écran immersif de 11 pouces avec taux de rafraîchissement de 90 Hz pour un défilement ultra-fluide. Ses 4 haut-parleurs compatibles Dolby Atmos transforment vos séances multimédia.",
    price: 229000,
    compareAtPrice: 259000,
    stock: 19,
    featured: false,
    isNew: false,
    salesCount: 38,
    ratingAvg: 4.5,
    ratingCount: 17,
    warrantyMonths: 12,
    brand: { name: "Samsung", slug: "samsung" },
    category: { name: "Tablettes", slug: "tablettes" },
    images: [
      {
        url: "/media/products/tablet_android-3a48f18876b062094dc4c545-1200.webp",
        mediumUrl: "/media/products/tablet_android-3a48f18876b062094dc4c545-640.webp",
        thumbUrl: "/media/products/tablet_android-3a48f18876b062094dc4c545-160.webp",
        alt: "Samsung Galaxy Tab A9 Plus Graphite",
      },
    ],
    specs: [
      { label: "Écran", value: "11,0 pouces WQXGA (1920 x 1200) 90 Hz" },
      { label: "Audio", value: "4 haut-parleurs compatibles Dolby Atmos" },
      { label: "Processeur", value: "Snapdragon 695 5G Octa-core" },
    ],
  },
  {
    id: "prod-wh1000xm5",
    name: "Sony WH-1000XM5 Casque Bluetooth Antibruit Noir",
    slug: "sony-wh-1000xm5-casque-antibruit-noir",
    sku: "SNY-WH1000XM5-BLK",
    shortDescription: "La référence mondiale de la réduction de bruit active, son Hi-Res sans fil LDAC, 30h d'autonomie.",
    description:
      "Le Sony WH-1000XM5 isole parfaitement du bruit ambiant grâce à ses deux processeurs et ses huit microphones dédiés. Le nouveau diaphragme de 30 mm offre un son haute résolution cristallin et des basses percutantes.",
    price: 389000,
    compareAtPrice: 429000,
    stock: 8,
    featured: true,
    isNew: true,
    salesCount: 56,
    ratingAvg: 4.9,
    ratingCount: 29,
    warrantyMonths: 12,
    brand: { name: "Sony", slug: "sony" },
    category: { name: "Audio & Casques", slug: "audio-casques" },
    images: [
      {
        url: "/media/products/headphones_anc-ea703f412d092b4f85444e21-1200.webp",
        mediumUrl: "/media/products/headphones_anc-ea703f412d092b4f85444e21-640.webp",
        thumbUrl: "/media/products/headphones_anc-ea703f412d092b4f85444e21-160.webp",
        alt: "Sony WH-1000XM5 Noir",
      },
    ],
    specs: [
      { label: "Réduction de bruit", value: "ANC avec processeurs QN1 et V1 intégrés" },
      { label: "Autonomie", value: "Jusqu'à 30h avec ANC" },
      { label: "Codecs", value: "LDAC, AAC, SBC (Hi-Res Audio)" },
    ],
  },
  {
    id: "prod-ch520",
    name: "Sony WH-CH520 Casque sans fil Bleu Céleste",
    slug: "sony-wh-ch520-casque-sans-fil-bleu",
    sku: "SNY-CH520-BLU",
    shortDescription: "Autonomie colossale de 50 heures, technologie DSEE d'optimisation sonore et confort ultra-léger.",
    description:
      "Avec jusqu'à 50 heures d'autonomie sur une seule charge, le Sony WH-CH520 ne vous lâchera jamais pendant la semaine. Son arceau réglable et ses coussinets moelleux garantissent un port agréable toute la journée.",
    price: 59000,
    compareAtPrice: 69000,
    stock: 25,
    featured: false,
    isNew: false,
    salesCount: 77,
    ratingAvg: 4.7,
    ratingCount: 31,
    warrantyMonths: 12,
    brand: { name: "Sony", slug: "sony" },
    category: { name: "Audio & Casques", slug: "audio-casques" },
    images: [
      {
        url: "/media/products/headphones_blue-605d3c155fc111355da035cd-1200.webp",
        mediumUrl: "/media/products/headphones_blue-605d3c155fc111355da035cd-640.webp",
        thumbUrl: "/media/products/headphones_blue-605d3c155fc111355da035cd-160.webp",
        alt: "Sony WH-CH520 Bleu",
      },
    ],
    specs: [
      { label: "Autonomie", value: "Jusqu'à 50 heures" },
      { label: "Poids", value: "147 grammes" },
      { label: "Connexion", value: "Bluetooth 5.2 multipoint" },
    ],
  },
  {
    id: "prod-earpro",
    name: "Écouteurs sans fil Pro ANC Blanc Brillant",
    slug: "ecouteurs-sans-fil-pro-anc-blanc",
    sku: "HT-EARPRO-WHT",
    shortDescription: "Réduction active du bruit, mode transparence, boîtier de charge sans fil et autonomie 24h.",
    description:
      "Ces écouteurs True Wireless allient un design ergonomique discret à une réduction active du bruit efficace pour vos trajets et appels quotidiens. Boîtier compact rechargeable par USB-C ou induction.",
    price: 89000,
    compareAtPrice: 119000,
    stock: 30,
    featured: false,
    isNew: true,
    salesCount: 68,
    ratingAvg: 4.6,
    ratingCount: 25,
    warrantyMonths: 12,
    brand: { name: "Apple", slug: "apple" },
    category: { name: "Audio & Casques", slug: "audio-casques" },
    images: [
      {
        url: "/media/products/earbuds_white-183cbc8046252aacdd4ba05c-1200.webp",
        mediumUrl: "/media/products/earbuds_white-183cbc8046252aacdd4ba05c-640.webp",
        thumbUrl: "/media/products/earbuds_white-183cbc8046252aacdd4ba05c-160.webp",
        alt: "Écouteurs sans fil Pro ANC Blanc",
      },
    ],
    specs: [
      { label: "Isolation", value: "Réduction active du bruit (ANC) + Transparence" },
      { label: "Autonomie", value: "6h par charge, jusqu'à 24h avec boîtier" },
      { label: "Recharge", value: "USB-C et sans fil Qi" },
    ],
  },
];

export const SEED_CATEGORIES = [
  {
    id: "cat-smartphones",
    name: "Smartphones",
    slug: "smartphones",
    description: "Les derniers smartphones Apple iPhone, Samsung Galaxy et Xiaomi garantis au Maroc.",
    count: 4,
  },
  {
    id: "cat-laptops",
    name: "PC Portables",
    slug: "pc-portables",
    description: "MacBook Apple, Lenovo ThinkPad & PC Gamer RTX au meilleur prix.",
    count: 3,
  },
  {
    id: "cat-tablettes",
    name: "Tablettes",
    slug: "tablettes",
    description: "Apple iPad et tablettes tactiles Samsung Android pour productivité et divertissement.",
    count: 2,
  },
  {
    id: "cat-audio",
    name: "Audio & Casques",
    slug: "audio-casques",
    description: "Casques antibruit sans fil Sony et écouteurs True Wireless haute fidélité.",
    count: 3,
  },
];

export const SEED_BRANDS = [
  { id: "b-apple", name: "Apple", slug: "apple" },
  { id: "b-samsung", name: "Samsung", slug: "samsung" },
  { id: "b-xiaomi", name: "Xiaomi", slug: "xiaomi" },
  { id: "b-lenovo", name: "Lenovo", slug: "lenovo" },
  { id: "b-sony", name: "Sony", slug: "sony" },
];

export const SEED_CITIES = [
  { id: "city-casa", name: "Casablanca", slug: "casablanca", fee: 2500, minDays: 1, maxDays: 1, codAvailable: true },
  { id: "city-rabat", name: "Rabat", slug: "rabat", fee: 3500, minDays: 1, maxDays: 2, codAvailable: true },
  { id: "city-marrakech", name: "Marrakech", slug: "marrakech", fee: 3500, minDays: 2, maxDays: 3, codAvailable: true },
  { id: "city-tanger", name: "Tanger", slug: "tanger", fee: 3500, minDays: 2, maxDays: 3, codAvailable: true },
  { id: "city-fes", name: "Fès", slug: "fes", fee: 3500, minDays: 2, maxDays: 3, codAvailable: true },
  { id: "city-agadir", name: "Agadir", slug: "agadir", fee: 4000, minDays: 2, maxDays: 4, codAvailable: true },
  { id: "city-meknes", name: "Meknès", slug: "meknes", fee: 3500, minDays: 2, maxDays: 3, codAvailable: true },
  { id: "city-oujda", name: "Oujda", slug: "oujda", fee: 4500, minDays: 3, maxDays: 5, codAvailable: true },
  { id: "city-autre", name: "Toutes autres villes du Maroc", slug: "maroc-autre", fee: 4500, minDays: 3, maxDays: 5, codAvailable: true },
];

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED, featured: true },
      include: { brand: true, category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { salesCount: "desc" },
      take: 8,
    });
    if (products.length > 0) {
      return products.map(formatDbProduct);
    }
  } catch (e) {
    // Fallback silencieux vers SEED_PRODUCTS
  }
  return SEED_PRODUCTS.filter((p) => p.featured);
}

export async function getLatestProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      include: { brand: true, category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    if (products.length > 0) {
      return products.map(formatDbProduct);
    }
  } catch (e) {
    // Fallback
  }
  return SEED_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { position: "asc" } },
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });
    if (p && p.status === ProductStatus.PUBLISHED) {
      return formatDbProduct(p);
    }
  } catch (e) {
    // Fallback
  }
  return SEED_PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      include: { _count: { select: { products: true } } },
    });
    if (categories.length > 0) {
      return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        count: c._count.products,
      }));
    }
  } catch (e) {
    // Fallback
  }
  return SEED_CATEGORIES;
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    if (brands.length > 0) {
      return brands;
    }
  } catch (e) {
    // Fallback
  }
  return SEED_BRANDS;
}

export async function getShippingCities() {
  try {
    const cities = await prisma.shippingCity.findMany({
      where: { isActive: true },
      orderBy: { fee: "asc" },
    });
    if (cities.length > 0) {
      return cities;
    }
  } catch (e) {
    // Fallback
  }
  return SEED_CITIES;
}

export async function searchCatalog(params: {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<CatalogProduct[]> {
  const { q, category, brand, sort, minPrice, maxPrice } = params;

  try {
    const where: any = { status: ProductStatus.PUBLISHED };
    if (category) {
      where.category = { slug: category };
    }
    if (brand) {
      where.brand = { slug: brand };
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { ratingAvg: "desc" };
    else if (sort === "popular") orderBy = { salesCount: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { brand: true, category: true, images: { orderBy: { position: "asc" } } },
      orderBy,
    });
    if (products.length > 0) {
      return products.map(formatDbProduct);
    }
  } catch (e) {
    // Fallback
  }

  // Filtrage mémoire depuis SEED_PRODUCTS
  let list = [...SEED_PRODUCTS];
  if (category) {
    list = list.filter((p) => p.category?.slug === category);
  }
  if (brand) {
    list = list.filter((p) => p.brand?.slug === brand);
  }
  if (q) {
    const cleanQ = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQ) ||
        p.shortDescription?.toLowerCase().includes(cleanQ) ||
        p.sku.toLowerCase().includes(cleanQ)
    );
  }
  if (minPrice !== undefined) {
    list = list.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    list = list.filter((p) => p.price <= maxPrice);
  }

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    list.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
  } else if (sort === "popular") {
    list.sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
  }

  return list;
}

function formatDbProduct(p: any): CatalogProduct {
  let specs: Array<{ label: string; value: string }> = [];
  if (Array.isArray(p.specs)) {
    specs = p.specs;
  } else if (typeof p.specs === "string") {
    try {
      specs = JSON.parse(p.specs);
    } catch {}
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    shortDescription: p.shortDescription || undefined,
    description: p.description || undefined,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    featured: p.featured,
    isNew: p.isNew,
    salesCount: p.salesCount,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    warrantyMonths: p.warrantyMonths,
    brand: p.brand ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug } : undefined,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : undefined,
    images:
      p.images && p.images.length > 0
        ? p.images.map((img: any) => ({
            url: img.url,
            mediumUrl: img.mediumUrl || img.url,
            thumbUrl: img.thumbUrl || img.url,
            alt: img.alt || p.name,
          }))
        : [
            {
              url: "/placeholder-product.webp",
              mediumUrl: "/placeholder-product.webp",
              thumbUrl: "/placeholder-product.webp",
              alt: p.name,
            },
          ],
    specs,
  };
}
