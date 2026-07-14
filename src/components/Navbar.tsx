"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const LINKS = [
    { href: "/services", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Lexma home">
          <Image
            src="/brand/lexma-logo-badge.png"
            alt="Lexma Real Estate Photography"
            width={80}
            height={80}
            className={styles.mark}
            priority
          />
        </Link>

        <div className={styles.links}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          <button
            className={styles.lang}
            aria-label={lang === "en" ? "Cambiar a Español" : "Switch to English"}
            onClick={() => setLang(lang === "en" ? "es" : "en")}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <Link href="/contact" className={`btn btn-gold ${styles.cta}`}>
            {t.nav.quote}
          </Link>
          <button
            className={styles.burger}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`${styles.menu} ${open ? styles.menuOpen : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className={`btn btn-gold ${styles.menuCta}`}
          onClick={() => setOpen(false)}
        >
          {t.nav.quote}
        </Link>
      </div>
    </nav>
  );
}
