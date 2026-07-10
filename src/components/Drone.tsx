"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Drone.module.css";

gsap.registerPlugin(ScrollTrigger);

const STAT_NUMS = [
  { n: 4, suffix: "K" },
  { n: 360, suffix: "°" },
  { n: 100, suffix: "%" },
];

export default function Drone() {
  const { lang, t } = useLang();
  const STATS = STAT_NUMS.map((s, i) => ({
    ...s,
    label: t.drone.stats[i],
  }));
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const droneRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // background slow pan (drone glide feel)
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

      // flight path draw + drone dot along it
      const path = pathRef.current;
      const drone = droneRef.current;
      if (path && drone) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        const prog = { t: 0 };
        gsap.to(prog, {
          t: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "bottom bottom",
            scrub: 0.7,
          },
          onUpdate: () => {
            const p = path.getPointAtLength(prog.t * len);
            gsap.set(drone, { x: p.x, y: p.y });
            gsap.set(path, { strokeDashoffset: len * (1 - prog.t) });
          },
        });
      }

      // stat counters
      const nums = gsap.utils.toArray<HTMLElement>(`.${styles.statNum}`, root);
      nums.forEach((el, i) => {
        const target = STATS[i].n;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + STATS[i].suffix;
          },
        });
      });

      // content rise
      gsap.from(`.${styles.grid} > *`, {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 55%" },
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.drone} aria-label="Drone media">
      <div className={styles.sticky}>
        <div className={styles.bg}>
          <Image
            src="/images/front/DJI_0168.jpg"
            alt="Aerial front view of a white Houston home photographed by Lexma drone"
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.shade} />

        <svg
          className={styles.path}
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="M -40 140 C 220 40, 420 260, 610 170 S 940 90, 1060 240"
            fill="none"
            stroke="rgba(232,192,111,0.65)"
            strokeWidth="1.6"
            strokeDasharray="6 7"
          />
          <g ref={droneRef}>
            {/* mini drone: body + arms + spinning rotors */}
            <rect x="-6" y="-3.5" width="12" height="7" rx="3" fill="var(--gold-bright)" />
            <g stroke="rgba(232,192,111,0.9)" strokeWidth="1.4">
              <line x1="-5" y1="-2.5" x2="-13" y2="-9" />
              <line x1="5" y1="-2.5" x2="13" y2="-9" />
              <line x1="-5" y1="2.5" x2="-13" y2="9" />
              <line x1="5" y1="2.5" x2="13" y2="9" />
            </g>
            <g fill="none" stroke="rgba(232,192,111,0.75)" strokeWidth="1.1">
              <ellipse className={styles.rotor} cx="-13" cy="-9" rx="7" ry="2.4" />
              <ellipse className={styles.rotor} cx="13" cy="-9" rx="7" ry="2.4" />
              <ellipse className={styles.rotor} cx="-13" cy="9" rx="7" ry="2.4" />
              <ellipse className={styles.rotor} cx="13" cy="9" rx="7" ry="2.4" />
            </g>
            <circle r="2" fill="var(--black)" />
          </g>
        </svg>

        <div className={styles.content}>
          <div className="container">
            <div className={styles.grid}>
              <div>
                <div className={styles.kicker}>{t.drone.kicker}</div>
                <h2 className={`${styles.title} h-display`}>
                  {t.drone.titlePre}
                  <em>{t.drone.titleEm}</em>
                </h2>
              </div>
              <div className={styles.stats}>
                {STATS.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <div className={styles.statNum}>0</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
