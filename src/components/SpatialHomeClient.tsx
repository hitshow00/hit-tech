"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { CatalogProduct } from "@/lib/catalog";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface SpatialHomeClientProps {
  featuredProducts: CatalogProduct[];
  latestProducts: CatalogProduct[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function SpatialHomeClient({
  featuredProducts,
  latestProducts,
  categories,
}: SpatialHomeClientProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const primarySkuRef = useRef<HTMLDivElement | null>(null);
  const secondarySkuRef = useRef<HTMLDivElement | null>(null);

  // Parallax fluide sur l'ancrage vidéo / visuel d'arrière-plan
  useEffect(() => {
    const updateParallax = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 1.2), 1);
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${progress * -8}vh) scale(${1 + progress * 0.06})`;
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        updateParallax();
        raf = 0;
      });
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  // Détection des entrées dans le viewport pour l'effet de révélation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Transition spatiale avec fallback sur View Transitions API
  const triggerSpatialTransition = async (element: HTMLDivElement | null) => {
    if (!element) return;

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (!doc.startViewTransition) {
      element.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.03)" },
          { transform: "scale(1)" },
        ],
        { duration: 360, easing: "cubic-bezier(.25,1,.3,1)" }
      );
      return;
    }

    const transition = doc.startViewTransition(() => {
      element.classList.toggle("ring-2");
      element.classList.toggle("ring-cyan-400");
      element.style.viewTransitionName = "active-sku";
    });

    await transition.finished;
    element.style.viewTransitionName = "";
  };

  // Suivi de curseur sur les boutons mercure liquide
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--x", `${e.clientX - rect.left}px`);
    target.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  // Produits phares pour le showcase spatial
  const flagship =
    featuredProducts.find((p) => p.slug.includes("s24") || p.slug.includes("ultra")) ||
    featuredProducts[0] ||
    null;

  const secondary =
    featuredProducts.find(
      (p) =>
        (p.slug.includes("air") || p.slug.includes("legion") || p.slug.includes("pro")) &&
        p.id !== flagship?.id
    ) ||
    featuredProducts[1] ||
    null;

  const categoryIcons: Record<string, React.ReactNode> = {
    smartphones: <Smartphone className="w-5 h-5 text-[var(--holo-blue)]" />,
    "pc-portables": <Laptop className="w-5 h-5 text-[var(--holo-blue)]" />,
    tablettes: <Tablet className="w-5 h-5 text-[var(--holo-blue)]" />,
    "audio-casques": <Headphones className="w-5 h-5 text-[var(--holo-blue)]" />,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[var(--spatial-text-main)] antialiased pb-24">
      {/* ────────────────── 1. FOND VIDÉO / VISUEL SPATIAL AVEC MASQUE RADIAL ────────────────── */}
      <div className="video-anchor fixed right-0 top-0 z-0 h-screen pointer-events-none [mask-image:radial-gradient(ellipse_150%_120%_at_100%_50%,black_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_150%_120%_at_100%_50%,black_60%,transparent_100%)]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center saturate-[1.1] contrast-[1.05]"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Fallback & Aura holographique continue même si la vidéo n'est pas fournie */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent mix-blend-screen pointer-events-none" />
        <div className="glass-portal absolute inset-0 pointer-events-none" />
      </div>

      {/* ────────────────── 2. BARRE D'ÉTAT SPATIALE DISCRÈTE ────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-zinc-500 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--holo-blue)] animate-pulse" />
          <span>Hit Tech Spatial Architecture</span>
        </div>
        <div className="hidden md:inline">Stock Officiel Scellé • Garantie Maroc</div>
        <div className="text-[var(--holo-blue)]">Casablanca Node 01</div>
      </div>

      {/* ────────────────── 3. HERO FRACTAL & SHOWCASE MATÉRIEL ────────────────── */}
      <main className="fractal-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Colonne gauche : Typographie monumentale & accroche */}
        <header className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--holo-blue)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--holo-blue)]" />
            </span>
            <span className="tracking-widest uppercase text-[10px] font-mono text-zinc-300">
              SÉLECTION OFFICIELLE • 2026
            </span>
          </div>

          <h1 className="gradient-text-spatial text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.94] tracking-tighter">
            Ingénierie.
            <br />
            Haute Précision.
            <br />
            Redéfinie.
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-[var(--spatial-text-muted)] font-light leading-relaxed">
            Une sélection exigeante d&apos;appareils électroniques de pointe. Smartphones flagships, ordinateurs de travail avancés et acoustique haute fidélité sous emballage constructeur scellé.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/boutique"
              onMouseMove={handleMove}
              className="liquid-mercury-btn rounded-full px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group shadow-lg"
            >
              <span>Explorer la Boutique</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/boutique?sort=new"
              onMouseMove={handleMove}
              className="px-6 py-4 rounded-full border border-white/10 hover:border-white/30 text-xs font-semibold uppercase tracking-wider text-[var(--spatial-text-muted)] hover:text-white transition-all backdrop-blur-sm"
            >
              Nouveaux Arrivages
            </Link>
          </div>
        </header>

        {/* Colonne droite : Volume Sculpté Primaire (SKU Flagship) */}
        {flagship && (
          <div className="lg:col-span-5 relative">
            <div
              ref={primarySkuRef}
              data-reveal
              className="sculpted-volume spatial-sku p-7 flex flex-col justify-between gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-zinc-400">
                  {flagship.sku || "SKU-FLAGSHIP"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Garantie 12M
                  </span>
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--holo-blue)] shadow-[0_0_12px_var(--holo-blue)] animate-pulse" />
                </div>
              </div>

              {/* Visuel immersif avec réflexion verre */}
              <Link
                href={`/produit/${flagship.slug}`}
                onClick={() => triggerSpatialTransition(primarySkuRef.current)}
                className="relative aspect-square w-full rounded-2xl overflow-hidden p-6 bg-gradient-to-tr from-white/[0.02] to-white/[0.06] flex items-center justify-center group"
              >
                <div className="absolute inset-0 bg-radial from-[var(--holo-blue)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <Image
                  src={
                    flagship.images[0]?.mediumUrl ||
                    flagship.images[0]?.url ||
                    "/placeholder-product.webp"
                  }
                  alt={flagship.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </Link>

              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[var(--holo-blue)]">
                    {flagship.brand?.name || "Hit Tech"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-white">
                      {flagship.ratingAvg?.toFixed(1) || "4.9"}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-light tracking-tight text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/produit/${flagship.slug}`}>{flagship.name}</Link>
                </h2>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tracking-tight">
                      {formatPrice(flagship.price)}
                    </span>
                    {flagship.compareAtPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatPrice(flagship.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <AddToCartButton
                      productId={flagship.id}
                      stock={flagship.stock}
                      compact
                      className="liquid-mercury-btn px-4 py-2.5 rounded-full text-xs font-semibold"
                    />
                    <Link
                      href={`/produit/${flagship.slug}`}
                      className="p-2.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                      title="Détails"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ────────────────── 4. SECOND VOLUME MATÉRIEL & VOLUME OVER PLANE ────────────────── */}
      {secondary && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5" data-reveal>
              <div className="sculpted-volume p-8 flex flex-col justify-between gap-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--holo-blue)]">
                  Volume Over Plane
                </span>
                <h3 className="text-2xl font-light text-white leading-tight">
                  Architecture Épurée & Profondeur Perceptive.
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Chaque appareil sélectionné par Hit Tech répond à un cahier des charges rigoureux : performance brute, intégrité d&apos;emballage d&apos;origine scellé et garantie constructeur active au Maroc.
                </p>
                <div className="pt-2">
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--holo-blue)] hover:underline"
                  >
                    <span>Consulter les spécifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-7" data-reveal>
              <div
                ref={secondarySkuRef}
                onClick={() => triggerSpatialTransition(secondarySkuRef.current)}
                className="sculpted-volume p-6 flex flex-col sm:flex-row items-center gap-6 cursor-pointer group"
              >
                <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden bg-white/[0.03] p-4 flex items-center justify-center">
                  <Image
                    src={
                      secondary.images[0]?.mediumUrl ||
                      secondary.images[0]?.url ||
                      "/placeholder-product.webp"
                    }
                    alt={secondary.name}
                    fill
                    sizes="150px"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      {secondary.sku}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">• Recommandé</span>
                  </div>
                  <h4 className="text-lg font-light text-white">{secondary.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {secondary.shortDescription || secondary.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-white">
                      {formatPrice(secondary.price)}
                    </span>
                    <Link
                      href={`/produit/${secondary.slug}`}
                      className="text-xs font-medium text-[var(--holo-blue)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                    >
                      <span>Découvrir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ────────────────── 5. CATÉGORIES EN VOLUMES SCULPTÉS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <div className="max-w-xl mb-8" data-reveal>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--holo-blue)] font-mono">
            Navigation Thématique
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
            Collections Technologiques
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?categorie=${cat.slug}`}
              data-reveal
              className="sculpted-volume p-6 flex flex-col justify-between aspect-[4/3] group"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-cyan-400/40 transition-colors">
                  {categoryIcons[cat.slug] || <Sparkles className="w-5 h-5 text-[var(--holo-blue)]" />}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h3 className="font-medium text-base text-white group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Matériel Certifié
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ────────────────── 6. VITRINE EXCLUSIVE DES PRODUITS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-white/10" data-reveal>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--holo-blue)] font-mono">
              Sélection Officielle
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
              Produits en Vedette
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>Explorer tout le catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => {
            const primaryImg = product.images[0];
            const imgSrc = primaryImg?.mediumUrl || primaryImg?.url || "/placeholder-product.webp";
            const discount =
              product.compareAtPrice && product.compareAtPrice > product.price
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : null;

            return (
              <article
                key={product.id}
                data-reveal
                className="sculpted-volume p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      {product.brand?.name || "Hit Tech"}
                    </span>
                    {discount && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/produit/${product.slug}`}
                    className="block relative aspect-square w-full rounded-xl overflow-hidden p-4 bg-white/[0.02] flex items-center justify-center mb-4"
                  >
                    <Image
                      src={imgSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                    />
                  </Link>

                  <h3 className="font-light text-sm text-white line-clamp-2 hover:text-cyan-300 transition-colors leading-snug">
                    <Link href={`/produit/${product.slug}`}>{product.name}</Link>
                  </h3>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-[11px] text-zinc-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <AddToCartButton
                    productId={product.id}
                    stock={product.stock}
                    compact
                    className="liquid-mercury-btn px-3 py-1.5 rounded-full text-xs font-semibold"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ────────────────── 7. PILIERS D'INGÉNIERIE & GARANTIES ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-reveal className="sculpted-volume p-7 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[var(--holo-blue)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-medium text-white">Matériel 100% Neuf & Scellé</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tous nos produits proviennent des filières officielles des constructeurs sous boîte d&apos;origine scellée avec numéro de série vérifiable.
            </p>
          </div>

          <div data-reveal className="sculpted-volume p-7 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[var(--holo-blue)]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-medium text-white">Expédition Sécurisée 24/48h</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Livraison rapide et remise en main propre à Casablanca, Rabat, Marrakech et dans toutes les villes du Maroc avec vérification à la réception.
            </p>
          </div>

          <div data-reveal className="sculpted-volume p-7 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[var(--holo-blue)]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-medium text-white">Garantie Officielle 12 à 24 Mois</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prise en charge intégrale par notre service après-vente dédié et application immédiate de la garantie légale constructeur.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── 8. AVIS CLIENTS VÉRIFIÉS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="max-w-xl mb-10" data-reveal>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--holo-blue)] font-mono">
            Expérience Client
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
            Témoignages Vérifiés
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-reveal className="sculpted-volume p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                « Matériel commandé et reçu sous emballage constructeur scellé d&apos;origine. Les performances correspondent en tous points à la fiche technique. Service précis et efficace. »
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">M. Tazi</span>
              <span className="text-zinc-500 text-[11px] font-mono">Casablanca</span>
            </div>
          </div>

          <div data-reveal className="sculpted-volume p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                « Commande traitée très rapidement. Emballage robuste garantissant l&apos;intégrité de l&apos;appareil pendant le transport. Excellente expérience. »
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">K. Alami</span>
              <span className="text-zinc-500 text-[11px] font-mono">Rabat</span>
            </div>
          </div>

          <div data-reveal className="sculpted-volume p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                « Clarté impeccable sur les spécifications et le suivi de commande. Matériel conforme, garantie confirmée. Je recommande vivement Hit Tech. »
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Y. Berrada</span>
              <span className="text-zinc-500 text-[11px] font-mono">Marrakech</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
