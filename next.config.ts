import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Les images sont déjà pré-optimisées en WebP par sharp
  images: {
    unoptimized: true,
  },
  // Modules natifs exécutés uniquement côté serveur
  serverExternalPackages: ["@node-rs/argon2", "sharp"],
  experimental: {
    serverActions: {
      // Téléversement d'images produits (5 Mo max par fichier, plusieurs fichiers)
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Redirections statiques (les redirections gérées depuis l'admin sont en base : table Redirect)
  async redirects() {
    return [
      { source: "/cgv", destination: "/conditions-generales-de-vente", permanent: true },
      { source: "/produits", destination: "/boutique", permanent: true },
    ];
  },
};

export default nextConfig;
