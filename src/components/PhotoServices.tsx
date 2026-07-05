"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./PhotoServices.module.css";

gsap.registerPlugin(ScrollTrigger);

const MEDIA = [
  {
    img: "/images/front/DSC_3902.jpg",
    alt: "Lexma real estate photography — stone facade Houston home",
  },
  {
    img: "/images/aerials/DJI_0119.jpg",
    alt: "Lexma drone aerial photography — community pool and lake",
  },
  {
    img: "/images/interior/DSC_4441.jpg",
    alt: "Lexma virtual staging — styled living room",
  },
  {
    img: "/images/interior/DSC_6155.jpg",
    alt: "Lexma Airbnb photography — downtown Houston condo",
  },
  {
    img: "/images/front/DSC_5654---Nightshot.jpg",
    alt: "Lexma twilight photography — Houston home at dusk",
  },
];

export default function PhotoServices() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();
  const SERVICES = t.photoServices.items.map((it, i) => ({
    ...it,
    ...MEDIA[i],
  }));

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const titles = gsap.utils.toArray<HTMLElement>(`.${styles.title}`, root);
      const frames = gsap.utils.toArray<HTMLElement>(`.${styles.frame}`, root);
      const bar = root.querySelector(`.${styles.progressBar}`);
      const n = SERVICES.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${n * 90}%`,
          pin: `.${styles.pin}`,
          scrub: 0.8,
        },
      });

      titles.forEach((t, i) => {
        const at = i;
        if (i === 0) {
          gsap.set(t, { opacity: 1, y: 0 });
          gsap.set(frames[0], { opacity: 1, scale: 1.04 });
        } else {
          tl.to(titles[i - 1], { opacity: 0, y: -46, duration: 0.35 }, at);
          tl.fromTo(
            t,
            { opacity: 0, y: 46 },
            { opacity: 1, y: 0, duration: 0.35 },
            at + 0.12
          );
          tl.to(frames[i - 1], { opacity: 0, scale: 1, duration: 0.4 }, at);
          tl.fromTo(
            frames[i],
            { opacity: 0, scale: 1.14 },
            { opacity: 1, scale: 1.04, duration: 0.45 },
            at + 0.05
          );
        }
        // subtle continuous zoom on the active frame
        tl.to(frames[i], { scale: 1, duration: 0.55 }, at + 0.4);
      });

      tl.to(bar, { scaleX: 1, ease: "none", duration: n }, 0);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div ref={rootRef} className={styles.wrap} id="services">
      <div className={styles.pin}>
        <div className={styles.inner}>
          <div>
            <div className={styles.kicker}>{t.photoServices.kicker}</div>
            <div className={styles.titles}>
              {SERVICES.map((s, i) => (
                <div key={i} className={styles.title}>
                  <div className={styles.count}>
                    <b>{String(i + 1).padStart(2, "0")}</b> /{" "}
                    {String(SERVICES.length).padStart(2, "0")}
                  </div>
                  <h3>
                    {s.pre}
                    <em>{s.em}</em>
                  </h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.cta}>
              <Link href="/contact" className="btn btn-outline">
                {t.photoServices.quote}
              </Link>
            </div>
          </div>

          <div className={styles.stage}>
            {SERVICES.map((s, i) => (
              <div key={i} className={styles.frame}>
                <Image
                  src={s.img}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 900px) 94vw, 45vw"
                />
              </div>
            ))}
            <div className={styles.progress}>
              <div className={styles.progressBar} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
