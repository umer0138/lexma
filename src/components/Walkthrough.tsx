"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Walkthrough.module.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 64;
const framePath = (i: number) =>
  `/walkthrough/f${String(i + 1).padStart(3, "0")}.webp`;

export default function Walkthrough() {
  const rootRef = useRef<HTMLElement>(null);
  const { lang, t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let loaded = false;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    setSize();

    // draw a frame with cover fitting
    const draw = (index: number) => {
      const img = images[Math.max(0, Math.min(FRAME_COUNT - 1, index))];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw = cw,
        dh = ch,
        dx = 0,
        dy = 0;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
      } else {
        dw = cw;
        dh = cw / ir;
        dy = (ch - dh) / 2;
      }
      ctx2d.clearRect(0, 0, cw, ch);
      ctx2d.drawImage(img, dx, dy, dw, dh);
    };

    const state = { frame: 0 };

    const preload = () => {
      if (loaded) return;
      loaded = true;
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = framePath(i);
        if (i === 0) img.onload = () => draw(0);
        images[i] = img;
      }
    };

    let cleanupResize: (() => void) | undefined;
    const gctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // start preloading a screen before the section arrives
      ScrollTrigger.create({
        trigger: root,
        start: "top 180%",
        once: true,
        onEnter: preload,
      });

      if (reduced) {
        preload();
        return;
      }

      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            draw(Math.round(state.frame));
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      const onResize = () => {
        setSize();
        draw(Math.round(state.frame));
      };
      window.addEventListener("resize", onResize);
      cleanupResize = () => window.removeEventListener("resize", onResize);
    }, root);

    return () => {
      cleanupResize?.();
      gctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section
      ref={rootRef}
      className={styles.wrap}
      aria-label="Virtual walkthrough preview"
    >
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.shade} />
        <div className={styles.head}>
          <div className={styles.kicker}>{t.walkthrough.kicker}</div>
          <h2 className={`${styles.title} h-display`}>
            {t.walkthrough.titlePre}
            <em>{t.walkthrough.titleEm}</em>
          </h2>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>{t.walkthrough.hint}</div>
          <div className={styles.progressTrack}>
            <div ref={fillRef} className={styles.progressFill} />
          </div>
        </div>
      </div>
    </section>
  );
}
