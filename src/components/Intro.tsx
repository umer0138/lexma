"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Intro.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const { lang, t } = useLang();
  const GOLD_WORDS = new Set(t.intro.goldWords);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll(`.${styles.statement} .word`);
      gsap.to(words, {
        color: "rgba(245,239,230,0.98)",
        stagger: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
      gsap.to(root.querySelectorAll(`.${styles.statement} .gold`), {
        color: "var(--gold-bright)",
        stagger: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 60%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <section ref={rootRef} className={styles.intro}>
      <div className="container">
        <div className={styles.kicker}>{t.intro.kicker}</div>
        <p className={`${styles.statement} h-display`}>
          {t.intro.sentence.split(" ").map((w, i) => (
            <span
              key={i}
              className={`word ${GOLD_WORDS.has(w.replace(/[.,—?¿!:;"”“]/g, "")) ? "gold" : ""}`}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
