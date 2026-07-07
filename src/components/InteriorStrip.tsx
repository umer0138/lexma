"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./InteriorStrip.module.css";

gsap.registerPlugin(ScrollTrigger);

const SHOTS = [
  { img: "/images/interior/DSC_5074.jpg", cap: "Grand Entry", tag: "Interior" },
  { img: "/images/interior/DSC_4449.jpg", cap: "Social Area", tag: "Interior" },
  { img: "/images/interior/DSC_5666.jpg", cap: "Kitchen & Dining", tag: "Interior" },
  { img: "/images/interior/DSC_7896-V1.jpg", cap: "Primary Suite", tag: "Interior" },
  { img: "/images/interior/DSC_6155.jpg", cap: "City-View Condo", tag: "Airbnb" },
  { img: "/images/interior/DSC_8740.jpg", cap: "Family Room", tag: "Interior" },
  { img: "/images/interior/DSC_3494.jpg", cap: "Bedroom Suite", tag: "Interior" },
];

export default function InteriorStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      const getDist = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 60);

      gsap.to(track, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${getDist()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.wrap} aria-label="Interior gallery">
      <div className={styles.pin}>
        <div className="container">
          <div className={styles.head}>
            <div>
              <div className={styles.kicker}>{t.interiors.kicker}</div>
              <h2 className={`${styles.title} h-display`}>
                {t.interiors.titlePre}
                <em>{t.interiors.titleEm}</em>
              </h2>
            </div>
            <div className={styles.hint}>{t.interiors.hint}</div>
          </div>
        </div>

        <div ref={trackRef} className={styles.track}>
          {SHOTS.map((s) => (
            <div key={s.img} className={styles.card}>
              <Image
                src={s.img}
                alt={`${s.cap} — Lexma ${s.tag.toLowerCase()} photography`}
                fill
                sizes="(max-width: 900px) 80vw, 40vw"
              />
              <div className={styles.cap}>
                <b>{s.tag}</b> {s.cap}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
