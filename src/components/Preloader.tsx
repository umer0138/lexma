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

    const logo = overlay.querySelector(`.${styles.logo}`);
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
        logo,
        { opacity: 0, scale: 0.88, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.75"
      ).to(overlay, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        delay: 0.55,
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
            r="48"
            stroke="var(--gold)"
            strokeWidth="0.9"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <Image
          src="/brand/lexma-badge-v2.png"
          alt=""
          width={300}
          height={300}
          className={styles.logo}
          priority
        />
      </div>
    </div>
  );
}
