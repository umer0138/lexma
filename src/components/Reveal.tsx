"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Generic scroll-reveal wrapper: children rise + fade in when entering view. */
export default function Reveal({
  children,
  y = 46,
  delay = 0,
  stagger = 0.1,
  selector,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  stagger?: number;
  /** if set, animates matching descendants instead of the wrapper */
  selector?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = selector ? el.querySelectorAll(selector) : el;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
    }, el);
    return () => ctx.revert();
  }, [y, delay, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
