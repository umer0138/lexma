"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { lang, t } = useLang();
  const HEADLINE = t.hero.words.map((w, i) => ({ text: w, gold: i === 2 }));
  const rootRef = useRef<HTMLElement>(null);
  const holeRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const bladesRef = useRef<SVGGElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll(`.${styles.word} > span`);
      const kicker = root.querySelector(`.${styles.kicker}`);
      const subline = root.querySelector(`.${styles.subline}`);
      const ctas = root.querySelector(`.${styles.ctas}`);
      const hint = root.querySelector(`.${styles.scrollHint}`);

      // ---- entrance (after preloader): aperture opens straight to the full house
      gsap.timeline({ delay: 2.6 })
        .to(ringRef.current, { attr: { r: 10.2 }, opacity: 1, duration: 0.5, ease: "power2.out" })
        .to(holeRef.current, { attr: { r: 95 }, duration: 1.5, ease: "power3.inOut" }, "-=0.1")
        .to(ringRef.current, { attr: { r: 96 }, opacity: 0, duration: 1.5, ease: "power3.inOut" }, "<")
        .to(
          bladesRef.current,
          { rotation: 40, scale: 2.6, opacity: 0, transformOrigin: "50% 50%", duration: 1.5, ease: "power3.inOut" },
          "<"
        )
        .fromTo(
          imageRef.current,
          { scale: 1.28 },
          { scale: 1, duration: 2, ease: "power2.out" },
          "<"
        )
        .to(kicker, { opacity: 1, duration: 0.6 }, "-=1.4")
        .to(words, { y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" }, "-=1.2")
        .to(subline, { opacity: 1, duration: 0.5 }, "-=0.6")
        .to(ctas, { opacity: 1, duration: 0.5 }, "-=0.3");

      // ---- scroll: gentle parallax drift + hint fade
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
        defaults: { ease: "none" },
      })
        .to(hint, { opacity: 0, duration: 0.2 }, 0.1)
        .to(imageRef.current, { yPercent: -6, duration: 0.8 }, 0.2);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Lexma intro">
      <div className={styles.sticky}>
        <div ref={imageRef} className={styles.imageWrap}>
          <Image
            src="/images/hero-main.jpg"
            alt="Twilight real estate photography by Lexma — Houston property at dusk"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.grade} />
        </div>

        {/* Aperture overlay */}
        <svg
          className={styles.aperture}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask id="aperture-mask">
              <rect width="100" height="100" fill="white" />
              <circle ref={holeRef} cx="50" cy="50" r="0" fill="black" />
            </mask>
          </defs>

          {/* black shroud with growing hole */}
          <rect
            width="100"
            height="100"
            fill="var(--black)"
            mask="url(#aperture-mask)"
          />

          {/* gold aperture ring */}
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="1"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.35"
            opacity="0"
          />

          {/* blade lines suggesting a lens iris */}
          <g ref={bladesRef} stroke="rgba(201,162,75,0.5)" strokeWidth="0.22">
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI) / 5;
              const x1 = 50 + Math.cos(a) * 10.5;
              const y1 = 50 + Math.sin(a) * 10.5;
              const x2 = 50 + Math.cos(a + 0.42) * 19;
              const y2 = 50 + Math.sin(a + 0.42) * 19;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        </svg>

        <div className={styles.content}>
          <div className={styles.kicker}>{t.hero.kicker}</div>
          <h1 className={`${styles.headline} h-display`}>
            {HEADLINE.map((w) => (
              <span
                key={w.text}
                className={`${styles.word} ${w.gold ? styles.gold : ""}`}
              >
                <span className={w.gold ? styles.gold : ""}>{w.text}</span>
              </span>
            ))}
          </h1>
          <p className={styles.subline}>
            {t.hero.subPre}
            <em>{t.hero.subEm}</em>
            {t.hero.subPost}
          </p>
          <div className={styles.ctas}>
            <Link href="/contact" className="btn btn-gold">
              {t.hero.ctaQuote}
            </Link>
            <Link href="/portfolio" className="btn btn-outline">
              {t.hero.ctaPortfolio}
            </Link>
          </div>
        </div>

        <div className={styles.scrollHint}>{t.hero.scroll}</div>
      </div>
    </section>
  );
}
