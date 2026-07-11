"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./PhotographerScene.module.css";

gsap.registerPlugin(ScrollTrigger);

const WALK = Array.from({ length: 8 }, (_, i) => `/avatar/walk/walk-${String(i + 1).padStart(2, "0")}.webp`);
const POSES = {
  lift: "/avatar/pose-02.webp",
  shoot: "/avatar/pose-03.webp",
  shoot2: "/avatar/pose-04.webp",
  lower: "/avatar/pose-05.webp",
  thumbs: "/avatar/pose-11.webp",
  wave: "/avatar/pose-12.webp",
};

const SHOT_MEDIA = [
  { img: "/images/front/DSC_3902.jpg", x: 50, y: 4, rot: 5 },
  { img: "/images/aerials/DJI_0119.jpg", x: 63, y: -7, rot: -6 },
  { img: "/images/apt-kitchen.jpg", x: 75, y: 2, rot: 8 },
];

// scene phases (scroll progress fractions)
const PH = {
  walkInEnd: 0.26,
  liftEnd: 0.34,
  shot1: 0.42,
  shot2: 0.56,
  lowerEnd: 0.66,
  thumbsEnd: 0.76,
  walkOutStart: 0.8,
};

export default function PhotographerScene() {
  const rootRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();
  const SHOTS = SHOT_MEDIA.map((s, i) => ({ ...s, cap: t.scene.caps[i] }));

  useLayoutEffect(() => {
    const root = rootRef.current;
    const figure = figureRef.current;
    if (!root || !figure) return;

    const ctx = gsap.context(() => {
      const frames = Array.from(
        figure.querySelectorAll<HTMLElement>(`.${styles.frame}`)
      );
      // frame keys in DOM order: 8 walk frames then the 6 poses
      const FRAME_KEYS = [...WALK.map((_, i) => `w${i}`), "lift", "shoot", "shoot2", "lower", "thumbs", "wave"];
      const show = (key: string) => {
        const idx = FRAME_KEYS.indexOf(key);
        frames.forEach((f, i) => f.classList.toggle(styles.frameOn, i === idx));
      };
      show("w0");

      const polaroids = gsap.utils.toArray<HTMLElement>(`.${styles.polaroid}`, root);
      const caption = root.querySelector(`.${styles.caption}`);
      const flash = flashRef.current;

      let firedFlash = [false, false];

      const strideFrames = 8;
      const walkFrame = (walkProgress: number, strides: number) =>
        `w${Math.floor(walkProgress * strides * strideFrames) % strideFrames}`;

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const vw = window.innerWidth;

          if (p < PH.walkInEnd) {
            // walk in: -25vw -> 36vw
            const t = p / PH.walkInEnd;
            const x = (-0.25 + t * 0.61) * vw;
            gsap.set(figure, { x, scaleX: 1 });
            show(walkFrame(t, 4));
          } else if (p < PH.liftEnd) {
            // flip: shoot toward the right, where the polaroids land
            gsap.set(figure, { x: 0.36 * vw, scaleX: -1 });
            show("lift");
          } else if (p < PH.shot1) {
            gsap.set(figure, { x: 0.36 * vw, scaleX: -1 });
            show("shoot");
          } else if (p < PH.shot2) {
            if (!firedFlash[0] && flash) {
              firedFlash[0] = true;
              gsap.fromTo(flash, { opacity: 0.95 }, { opacity: 0, duration: 0.5, ease: "power2.out" });
              gsap.fromTo(polaroids[0], { opacity: 0, x: -0.2 * vw, y: 120, rotation: -18, scale: 0.3 }, { opacity: 1, x: 0, y: 0, rotation: SHOTS[0].rot, scale: 1, duration: 0.8, ease: "back.out(1.4)" });
              gsap.fromTo(polaroids[1], { opacity: 0 }, { opacity: 0, duration: 0.1 });
            }
            gsap.set(figure, { scaleX: -1 });
            show("shoot2");
          } else if (p < PH.lowerEnd) {
            if (!firedFlash[1] && flash) {
              firedFlash[1] = true;
              gsap.fromTo(flash, { opacity: 0.95 }, { opacity: 0, duration: 0.5, ease: "power2.out" });
              gsap.fromTo(polaroids[1], { opacity: 0, x: -0.28 * vw, y: 140, rotation: 16, scale: 0.3 }, { opacity: 1, x: 0, y: 0, rotation: SHOTS[1].rot, scale: 1, duration: 0.8, ease: "back.out(1.4)" });
              gsap.fromTo(polaroids[2], { opacity: 0, x: -0.34 * vw, y: 150, rotation: -14, scale: 0.3 }, { opacity: 1, x: 0, y: 0, rotation: SHOTS[2].rot, scale: 1, duration: 0.8, delay: 0.25, ease: "back.out(1.4)" });
            }
            gsap.set(figure, { scaleX: -1 });
            show("lower");
          } else if (p < PH.thumbsEnd) {
            gsap.set(figure, { scaleX: 1 });
            show("thumbs");
            if (caption) gsap.to(caption, { opacity: 1, duration: 0.4 });
          } else if (p < PH.walkOutStart) {
            // goodbye wave before walking off
            gsap.set(figure, { scaleX: 1 });
            show("wave");
          } else {
            // walk out: 36vw -> 115vw
            const t = (p - PH.walkOutStart) / (1 - PH.walkOutStart);
            const x = (0.36 + t * 0.85) * vw;
            gsap.set(figure, { x, scaleX: 1 });
            show(walkFrame(t, 3));
          }

          // reset flash gates when scrolling back above the shot points
          if (p < PH.shot1 - 0.04) firedFlash[0] = false;
          if (p < PH.shot2 - 0.04) firedFlash[1] = false;
        },
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.wrap} aria-label="Lexma photographer at work">
      <div className={styles.sticky}>
        <div className={styles.stage} />
        <div className={styles.ground} />

        <div className={styles.head}>
          <div className={styles.kicker}>{t.scene.kicker}</div>
          <h2 className={`${styles.title} h-display`}>
            {t.scene.titlePre}
            <em>{t.scene.titleEm}</em>
          </h2>
        </div>

        <div ref={figureRef} className={styles.figure}>
          {/* frames load eagerly — lazy-loading images inside hidden frames is
              unreliable across browsers and can leave the character invisible */}
          {WALK.map((src, i) => (
            <div key={src} className={styles.frame} data-key={`w${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          ))}
          {Object.entries(POSES).map(([key, src]) => (
            <div key={key} className={styles.frame} data-key={key}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {SHOTS.map((s, i) => (
          <div
            key={s.img}
            className={`${styles.polaroid} ${styles[`p${i}`]}`}
            style={{ left: `${s.x}vw`, bottom: `${46 + s.y}vh` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={`${s.cap} shot by Lexma`} loading="lazy" />
            <div className={styles.polaroidCap}>{s.cap}</div>
          </div>
        ))}

        <div className={styles.caption}>{t.scene.caption}</div>

        <div ref={flashRef} className={styles.flash} />
      </div>
    </section>
  );
}
