"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Déclenche l'apparition dès que l'utilisateur dépasse 50px de scroll
      const shouldShow = window.scrollY > 50;
      setScrolled(shouldShow);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <>
      {/* Espaceur réservé uniquement sur les pages secondaires pour éviter tout chevauchement */}
      {!isHomePage && <div className="h-16 w-full" aria-hidden="true" />}

      {/* Barre de navigation fixe avec transition fluide Awwwards */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "translate-y-0 opacity-100 pointer-events-auto shadow-2xl"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </>
  );
}
