"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./ServiceGallery.module.css";

type Lenis = { stop: () => void; start: () => void };

export type GalleryShot = { src: string; cap: string };

/**
 * Clickable service media that opens a cinematic fullscreen gallery.
 * Slides show the FULL photo (object-fit: contain) — nothing gets cropped.
 */
export default function ServiceGallery({
  img,
  alt,
  img2,
  alt2,
  shots,
  label,
  hint,
}: {
  img: string;
  alt: string;
  img2?: string;
  alt2?: string;
  shots: GalleryShot[];
  label: string;
  hint: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
      {img2 ? (
        <div className={styles.stack}>
          <MediaButton img={img} alt={alt} hint={hint} onOpen={() => setOpenAt(0)} wide />
          <MediaButton img={img2} alt={alt2 ?? alt} hint={hint} onOpen={() => setOpenAt(1)} wide />
        </div>
      ) : (
        <MediaButton img={img} alt={alt} hint={hint} onOpen={() => setOpenAt(0)} />
      )}

      {openAt !== null && (
        <Lightbox
          shots={shots}
          label={label}
          start={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}

function MediaButton({
  img,
  alt,
  hint,
  onOpen,
  wide,
}: {
  img: string;
  alt: string;
  hint: string;
  onOpen: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.media} ${wide ? styles.mediaWide : ""}`}
      onClick={onOpen}
      aria-label={`${alt} — ${hint}`}
    >
      <Image src={img} alt={alt} fill sizes="(max-width: 860px) 92vw, 46vw" />
      <span className={styles.hintChip}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
        </svg>
        {hint}
      </span>
    </button>
  );
}

function Lightbox({
  shots,
  label,
  start,
  onClose,
}: {
  shots: GalleryShot[];
  label: string;
  start: number;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(start);
  const animatingRef = useRef(false);
  const [idx, setIdx] = useState(start);
  const total = shots.length;

  // lock page scroll (Lenis) while open
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, []);

  // entrance
  useEffect(() => {
    const ov = overlayRef.current;
    const track = trackRef.current;
    if (!ov || !track) return;
    gsap.set(track, { xPercent: -100 * start });
    gsap.fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    const slide = track.children[start]?.querySelector(`.${styles.shotImg}`);
    if (slide) {
      gsap.fromTo(
        slide,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    }
    if (barRef.current) {
      gsap.set(barRef.current, { scaleX: (start + 1) / total });
    }
  }, [start, total]);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track || animatingRef.current) return;
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === idxRef.current) return;
      animatingRef.current = true;
      const dir = clamped > idxRef.current ? 1 : -1;
      idxRef.current = clamped;
      setIdx(clamped);

      gsap.to(track, {
        xPercent: -100 * clamped,
        duration: 0.85,
        ease: "power3.inOut",
        onComplete: () => {
          animatingRef.current = false;
        },
      });
      const img = track.children[clamped]?.querySelector(`.${styles.shotImg}`);
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.08, xPercent: 4 * dir },
          { scale: 1, xPercent: 0, duration: 0.9, ease: "power3.out" }
        );
      }
      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleX: (clamped + 1) / total,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    },
    [total]
  );

  const close = useCallback(() => {
    const ov = overlayRef.current;
    if (!ov) return onClose();
    gsap.to(ov, { opacity: 0, duration: 0.32, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  // wheel, keys, touch
  useEffect(() => {
    let wheelLock = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLock || animatingRef.current) return;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 12) return;
      wheelLock = true;
      setTimeout(() => (wheelLock = false), 500);
      goTo(idxRef.current + (d > 0 ? 1 : -1));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(idxRef.current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(idxRef.current - 1);
    };
    let tx = 0;
    const onTouchStart = (e: TouchEvent) => (tx = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 48) goTo(idxRef.current + (dx < 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo, close]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} gallery`}
    >
      <div className={styles.chrome}>
        <div className={styles.lbLabel}>{label}</div>
        <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close gallery">
          ✕
        </button>
      </div>

      <div className={styles.progress}>
        <div ref={barRef} className={styles.progressFill} />
      </div>

      <div ref={trackRef} className={styles.track}>
        {shots.map((s, i) => (
          <figure key={s.src} className={styles.slide}>
            <div className={styles.shotImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.cap}
                loading={i === start ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            <figcaption className={styles.cap}>{s.cap}</figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        aria-label="Previous photo"
      >
        ←
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => goTo(idx + 1)}
        disabled={idx === total - 1}
        aria-label="Next photo"
      >
        →
      </button>

      <div className={styles.counter}>
        {String(idx + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
