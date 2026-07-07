"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import { SOLUTION_CARD_ART } from "./ServicePreviews";
import styles from "./Solutions.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Solutions() {
  const { lang, t } = useLang();
  const SERVICES_T = t.solutions.services;
  const rootRef = useRef<HTMLElement>(null);
  const gyroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      // intro rise
      gsap.from(`.${styles.intro} > * > *`, {
        y: 44,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.intro}`, start: "top 74%" },
      });

      // cards stagger + settle in
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`, root);
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          rotationX: 6,
          transformPerspective: 900,
          duration: 0.9,
          delay: (i % 3) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });

      // --- 3D gyroscope journeys left -> right -> left across the section
      const gyro = gyroRef.current;
      if (gyro) {
        gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.8,
          },
          defaults: { ease: "none" },
        })
          .fromTo(
            gyro,
            { xPercent: -160, yPercent: -70, opacity: 0, rotateZ: -30, scale: 0.8 },
            { xPercent: 40, yPercent: -55, opacity: 0.85, rotateZ: 30, scale: 1, duration: 0.35 }
          )
          .to(gyro, {
            xPercent: -120,
            yPercent: -40,
            rotateZ: 100,
            scale: 1.12,
            duration: 0.35,
          })
          .to(gyro, {
            xPercent: 10,
            yPercent: -50,
            rotateZ: 170,
            scale: 0.92,
            opacity: 0.9,
            duration: 0.3,
          });
      }
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.wrap} id="solutions">
      {/* gold slash transition */}
      <svg
        className={styles.slash}
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 160 L1440 30 L1440 160 Z" fill="var(--cream)" />
        <path
          d="M0 160 L1440 30"
          stroke="var(--gold)"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 3D golden gyroscope drifting behind the whole section */}
      <div className={styles.bgStage} aria-hidden="true">
        <div ref={gyroRef} className={styles.gyro}>
          <div className={styles.gyroCore} />
          <div className={styles.gyroRing} />
          <div className={styles.gyroRing} />
          <div className={styles.gyroRing} />
        </div>
      </div>

      <div className={styles.intro}>
        <div className="container">
          <Image
            src="/brand/lexma-digital-logo.png"
            alt="Lexma Digital Solutions"
            width={400}
            height={200}
            className={styles.brandLogo}
          />
          <div className={styles.introKicker}>{t.solutions.kicker}</div>
          <h2 className={`${styles.introTitle} h-display`}>
            {t.solutions.titlePre}
            <em>{t.solutions.titleEm}</em>
            {t.solutions.titlePost}
          </h2>
          <p className={styles.introSub}>{t.solutions.sub}</p>
        </div>
      </div>

      <div className={styles.cardsZone}>
        <div className="container">
          <div className={styles.cardGrid}>
            {SERVICES_T.map((s, i) => (
              <article
                key={s.name}
                className={`${styles.card} ${i === 0 ? styles.cardWide : ""}`}
              >
                <div className={styles.cardArt} aria-hidden="true">
                  {SOLUTION_CARD_ART[i]}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.cardName}>{s.name}</h3>
                  <p className={styles.cardDesc}>{s.desc}</p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(s.name)}`}
                    className={styles.cardLink}
                  >
                    {t.solutions.quote}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
