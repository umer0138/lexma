"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLang();
  const items = [...t.footer.marquee, ...t.footer.marquee];

  return (
    <footer className={styles.footer}>
      <Link href="/contact" className={styles.bigCta}>
        <div className={`${styles.bigText} h-display`}>
          {t.footer.bigPre}
          <em>{t.footer.bigEm}</em>
        </div>
        <div className={styles.bigSub}>{t.footer.bigSub}</div>
      </Link>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {items.map((m, i) => (
            <span key={i}>
              {m} <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Image
              src="/brand/lexma-logo-badge.png"
              alt="Lexma Real Estate Photography"
              width={190}
              height={190}
              className={styles.mark}
            />
            <p className={styles.brandLine}>{t.footer.brandLine}</p>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>{t.footer.explore}</div>
            <Link href="/services">{t.nav.services}</Link>
            <Link href="/portfolio">{t.nav.portfolio}</Link>
            <Link href="/about">{t.nav.about}</Link>
            <Link href="/contact">{t.nav.contact}</Link>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>{t.footer.services}</div>
            <Link href="/services#photography">{t.footer.links.photography}</Link>
            <Link href="/services#drone">{t.footer.links.drone}</Link>
            <Link href="/services#staging">{t.footer.links.staging}</Link>
            <Link href="/services#solutions">{t.footer.links.solutions}</Link>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>{t.footer.contact}</div>
            <a href="tel:+13465586955">346-558-6955</a>
            <a href="tel:+13465586963">346-558-6963</a>
            <a href="mailto:info@lexmasolutions.com">info@lexmasolutions.com</a>
            <a
              href="https://www.instagram.com/lexmasolutions/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <p>{t.footer.area}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} Lexma. {t.footer.rights}
          </span>
          <span>Lexma Real Estate Photography · Lexma Solutions</span>
        </div>
      </div>
    </footer>
  );
}
