"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Outro.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Outro() {
  const rootRef = useRef<HTMLElement>(null);
  const { lang, t } = useLang();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.bg}`,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.from(`.${styles.content} > *`, {
        y: 46,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 62%" },
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.outro}>
      <div className={styles.bg}>
        <Image
          src="/images/houston.jpg"
          alt="Downtown Houston skyline photographed from the air by Lexma"
          fill
          sizes="100vw"
        />
      </div>
      <div className={styles.shade} />
      <div className={styles.content}>
        <div className={styles.kicker}>{t.outro.kicker}</div>
        <h2 className={`${styles.title} h-display`}>
          {t.outro.titlePre}
          <em>{t.outro.titleEm}</em>
        </h2>
        <p className={styles.sub}>{t.outro.sub}</p>
        <div className={styles.ctas}>
          <Link href="/contact" className="btn btn-gold">
            {t.outro.ctaQuote}
          </Link>
          <a
            href="https://wa.me/13465586955"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {t.outro.ctaWhats}
          </a>
        </div>
        <div className={styles.phone}>
          {t.outro.callPre} <a href="tel:+13465586955">346-558-6955</a> ·{" "}
          <a href="tel:+13465586963">346-558-6963</a>
        </div>
      </div>
    </section>
  );
}
