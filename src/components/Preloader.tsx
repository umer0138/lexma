"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const letters = overlay.querySelectorAll(`.${styles.wordmark} span`);
    const tagline = overlay.querySelector(`.${styles.tagline}`);
    const mark = overlay.querySelector(`.${styles.mark}`);
    const ring = ringRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      });

      if (ring) {
        const len = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(ring, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
        });
      }

      tl.fromTo(
        mark,
        { opacity: 0, scale: 0.86, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.7"
      )
        .to(
          letters,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .to(tagline, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to(overlay, {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
          delay: 0.35,
        });
    }, overlay);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <div className={styles.emblem}>
        <svg className={styles.ring} viewBox="0 0 100 100" fill="none">
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="47"
            stroke="var(--gold)"
            strokeWidth="1.2"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <Image
          src="/brand/lexma-mark.png"
          alt=""
          width={120}
          height={63}
          className={styles.mark}
          priority
        />
      </div>
      <div className={styles.wordmark}>
        <span>L</span>
        <span>E</span>
        <span className={styles.x}>X</span>
        <span>M</span>
        <span>A</span>
      </div>
      <div className={styles.tagline}>Real Estate Photography</div>
    </div>
  );
}
