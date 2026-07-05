"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY, CAT_LABELS } from "@/lib/gallery";
import styles from "./PortfolioGallery.module.css";

gsap.registerPlugin(ScrollTrigger);

const TABS = ["all", "aerials", "front", "interior"] as const;

function GalleryInner() {
  const params = useSearchParams();
  const deepLink = params.get("img");
  const initialIdx = deepLink
    ? GALLERY.findIndex((g) => g.src === deepLink)
    : -1;

  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [lightbox, setLightbox] = useState<number | null>(
    initialIdx >= 0 ? initialIdx : null
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const items = tab === "all" ? GALLERY : GALLERY.filter((g) => g.cat === tab);

  // reveal animation on tab change
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { y: 34, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.035,
          duration: 0.7,
          ease: "power3.out",
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    }, grid);
    return () => ctx.revert();
  }, [tab]);

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? null : (cur + dir + items.length) % items.length
      );
    },
    [items.length]
  );

  // keyboard nav for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
              onClick={() => {
                setTab(t);
                setLightbox(null);
              }}
            >
              {CAT_LABELS[t]}
            </button>
          ))}
          <span className={styles.count}>
            {items.length} {items.length === 1 ? "shot" : "shots"}
          </span>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {items.map((g, i) => (
            <div
              key={g.src}
              className={styles.item}
              onClick={() => setLightbox(i)}
              role="button"
              aria-label={`Open ${CAT_LABELS[g.cat]} photo`}
            >
              <Image
                src={g.src}
                alt={`${CAT_LABELS[g.cat]} — Lexma real estate photography, Greater Houston Area`}
                width={800}
                height={534}
                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw"
                style={{ width: "100%", height: "auto" }}
              />
              <span className={styles.itemTag}>{CAT_LABELS[g.cat]}</span>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && items[lightbox] !== undefined && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={items[lightbox].src}
            alt="Lexma real estate photography — full view"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={`${styles.lbBtn} ${styles.lbPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
          >
            ←
          </button>
          <button
            className={`${styles.lbBtn} ${styles.lbNext}`}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
          >
            →
          </button>
          <button
            className={styles.lbClose}
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className={styles.lbCount}>
            {lightbox + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  );
}

export default function PortfolioGallery() {
  return (
    <Suspense fallback={null}>
      <GalleryInner />
    </Suspense>
  );
}
