"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./FeaturedWork.module.css";

gsap.registerPlugin(ScrollTrigger);

const WORK = [
  { img: "/images/front/DSC_5654---Nightshot.jpg", tag: "Twilight", alt: "Twilight exterior shot of modern Houston home" },
  { img: "/images/aerials/DJI_0007.jpg", tag: "Aerial", alt: "Aerial drone view of Houston property" },
  { img: "/images/apt-living.jpg", tag: "Airbnb", alt: "Modern white and gold apartment living area" },
  { img: "/images/front/DJI_0019.jpg", tag: "Exterior", alt: "Front elevation of Houston home" },
  { img: "/images/interior/DSC_2992.jpg", tag: "Interior", alt: "Bright staged interior" },
];

export default function FeaturedWork() {
  const rootRef = useRef<HTMLElement>(null);
  const { lang, t } = useLang();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(`.${styles.item}`, root);

      // cinematic clip-path wipe reveal + inner image settle
      items.forEach((item, i) => {
        const img = item.querySelector("img");
        gsap.fromTo(
          item,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            delay: (i % 3) * 0.12,
            ease: "power4.inOut",
            scrollTrigger: { trigger: item, start: "top 88%" },
          }
        );
        gsap.fromTo(
          img,
          { scale: 1.35, yPercent: 8 },
          {
            scale: 1,
            yPercent: 0,
            duration: 1.5,
            delay: (i % 3) * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          }
        );
      });

      // 3D cursor tilt (desktop only)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        items.forEach((item) => {
          const rx = gsap.quickTo(item, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(item, "rotationY", { duration: 0.5, ease: "power3.out" });
          gsap.set(item, { transformPerspective: 800 });
          item.addEventListener("mousemove", (e) => {
            const r = item.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * 7);
            ry(px * 9);
          });
          item.addEventListener("mouseleave", () => {
            rx(0);
            ry(0);
          });
        });
      }
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.wrap} aria-label="Featured work">
      <div className="container">
        <div className={styles.head}>
          <div>
            <div className={styles.kicker}>{t.featured.kicker}</div>
            <h2 className={`${styles.title} h-display`}>
              {t.featured.titlePre}
              <em>{t.featured.titleEm}</em>
            </h2>
          </div>
          <Link href="/portfolio" className="btn btn-outline">
            {t.featured.cta}
          </Link>
        </div>

        <div className={styles.grid}>
          {WORK.map((w) => (
            <Link
              href={`/portfolio?img=${encodeURIComponent(w.img)}`}
              key={w.img}
              className={styles.item}
              aria-label={`${w.tag} photography example — open in portfolio`}
            >
              <Image
                src={w.img}
                alt={w.alt}
                fill
                sizes="(max-width: 800px) 50vw, 33vw"
              />
              <span className={styles.tag}>{w.tag}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
