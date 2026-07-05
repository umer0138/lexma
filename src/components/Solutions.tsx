"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/lib/i18n";
import styles from "./Solutions.module.css";

gsap.registerPlugin(ScrollTrigger);

// kept for reference; live text comes from the i18n dictionary
const SERVICES = [
  {
    name: "Website Design & Development",
    desc: "Professional websites for businesses, service providers, real estate brands, and companies that need a clean online presence — landing pages, business websites, contact and quote forms, booking options, and sites connected to WhatsApp, email, or CRM systems.",
  },
  {
    name: "Custom Business Software",
    desc: "Custom digital systems built for business operations — client portals, admin dashboards, booking systems, internal platforms, private catalogs, inventory tools, and custom online platforms designed around your workflow.",
  },
  {
    name: "Automation Services",
    desc: "Automation for repetitive business tasks that saves time and reduces manual work — automated forms, email notifications, WhatsApp alerts, Google Sheets updates, lead follow-ups, appointment reminders, and automated reporting.",
  },
  {
    name: "Business Tool Integration",
    desc: "Connecting your business tools so they work together automatically — website forms to Google Sheets, CRM systems, email campaigns, WhatsApp notifications, calendars, quote requests, and internal databases.",
  },
  {
    name: "AI Automation & Intelligent Workflows",
    desc: "AI-powered workflows that help businesses manage information, respond faster, and organize operations — AI-assisted replies, customer classification, automated summaries, document review, report generation, and smart multi-tool workflows.",
  },
  {
    name: "SEO & Google Ads",
    desc: "Search visibility and paid advertising for businesses that want to appear better online — on-page SEO optimization, Google search visibility improvements, keyword targeting, and Google Ads campaign setup.",
  },
  {
    name: "Email Marketing Automation",
    desc: "Automated email campaigns for customer follow-up, promotions, reminders, newsletters, and sales sequences — stay connected with leads and clients without manually sending every message.",
  },
  {
    name: "WhatsApp & CRM Automation",
    desc: "Capture and organize leads from WhatsApp, website forms, or social media — automatic replies, lead collection, customer segmentation, follow-up alerts, and client data stored neatly in a CRM or Google Sheets system.",
  },
  {
    name: "Business Dashboards & Reports",
    desc: "Simple dashboards and reports that help business owners track leads, sales, appointments, campaign results, customer activity, and monthly performance at a glance.",
  },
  {
    name: "AI Business Assistants",
    desc: "Custom AI assistants designed to support business operations — answering common questions, organizing leads, preparing responses, summarizing conversations, creating quotes, and supporting internal team tasks.",
  },
];

import { SERVICE_PREVIEWS } from "./ServicePreviews";

export default function Solutions() {
  const { lang, t } = useLang();
  const SERVICES_T = t.solutions.services;
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const railProgressRef = useRef<HTMLDivElement>(null);
  const gyroRef = useRef<HTMLDivElement>(null);
  const hoverCardRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const openRef = useRef(0);
  openRef.current = open;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanupHover: (() => void) | undefined;
    const ctx = gsap.context(() => {
      // intro rise
      gsap.from(`.${styles.intro} > *`, {
        y: 44,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.intro}`, start: "top 74%" },
      });
      // rows stagger in
      gsap.from(`.${styles.row}`, {
        y: 34,
        opacity: 0,
        stagger: 0.06,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.list}`, start: "top 78%" },
      });

      // --- golden lens orb magnetically docks to the row nearest viewport center
      const orb = orbRef.current;
      const list = listRef.current;
      const rail = orb?.parentElement;
      if (orb && list && rail) {
        let lastIdx = -1;
        ScrollTrigger.create({
          trigger: list,
          start: "top 80%",
          end: "bottom 20%",
          onUpdate: () => {
            const line = window.innerHeight * 0.44;
            const heads = list.querySelectorAll<HTMLElement>(
              `.${styles.rowHead}`
            );
            let idx = 0;
            let best = Infinity;
            heads.forEach((h, i) => {
              const r = h.getBoundingClientRect();
              const d = Math.abs(r.top + r.height / 2 - line);
              if (d < best) {
                best = d;
                idx = i;
              }
            });

            if (idx !== lastIdx) {
              lastIdx = idx;
              setOpen(idx);
              const railTop = rail.getBoundingClientRect().top;
              const hr = heads[idx].getBoundingClientRect();
              const y = hr.top + hr.height / 2 - railTop;
              gsap.to(orb, {
                top: y,
                duration: 0.75,
                ease: "elastic.out(1, 0.65)",
                overwrite: "auto",
              });
              gsap.to(orb, {
                rotation: idx * 36,
                duration: 0.75,
                ease: "power2.out",
              });
              if (railProgressRef.current) {
                gsap.to(railProgressRef.current, {
                  scaleY: y / rail.offsetHeight,
                  duration: 0.6,
                  ease: "power2.out",
                });
              }
            }
          },
        });
      }
      // --- 3D gyroscope journeys left -> right -> left across the section
      const gyro = gyroRef.current;
      if (gyro) {
        gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.8,
          },
          defaults: { ease: "none" },
        })
          .fromTo(
            gyro,
            { xPercent: -160, yPercent: -70, opacity: 0, rotateZ: -30, scale: 0.8 },
            { xPercent: 40, yPercent: -55, opacity: 0.85, rotateZ: 30, scale: 1, duration: 0.35 }
          )
          .to(gyro, {
            xPercent: -120,
            yPercent: -40,
            rotateZ: 100,
            scale: 1.12,
            duration: 0.35,
          })
          .to(gyro, {
            xPercent: 10,
            yPercent: -50,
            rotateZ: 170,
            scale: 0.92,
            opacity: 0.9,
            duration: 0.3,
          });
      }

      // --- cursor-following hover preview (desktop pointers only)
      const card = hoverCardRef.current;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (card && list && fine) {
        const xTo = gsap.quickTo(card, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          xTo(e.clientX + 26);
          yTo(e.clientY - 190);
        };
        const enter = () =>
          gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
        const leave = () =>
          gsap.to(card, { autoAlpha: 0, scale: 0.92, duration: 0.3 });
        list.addEventListener("mousemove", move);
        list.addEventListener("mouseenter", enter);
        list.addEventListener("mouseleave", leave);
        gsap.set(card, { scale: 0.92 });
        cleanupHover = () => {
          list.removeEventListener("mousemove", move);
          list.removeEventListener("mouseenter", enter);
          list.removeEventListener("mouseleave", leave);
        };
      }
    }, root);
    return () => {
      cleanupHover?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // accordion open/close animation
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bodies = root.querySelectorAll<HTMLElement>(`.${styles.body}`);
    bodies.forEach((b, i) => {
      gsap.to(b, {
        height: i === open ? "auto" : 0,
        opacity: i === open ? 1 : 0,
        duration: 0.55,
        ease: "power3.inOut",
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <section ref={rootRef} className={styles.wrap} id="solutions">
      {/* gold slash transition */}
      <svg
        className={styles.slash}
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 160 L1440 30 L1440 160 Z" fill="var(--cream)" />
        <path
          d="M0 160 L1440 30"
          stroke="var(--gold)"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 3D golden gyroscope drifting behind the whole section */}
      <div className={styles.bgStage} aria-hidden="true">
        <div ref={gyroRef} className={styles.gyro}>
          <div className={styles.gyroCore} />
          <div className={styles.gyroRing} />
          <div className={styles.gyroRing} />
          <div className={styles.gyroRing} />
        </div>
      </div>

      {/* cursor-following preview card */}
      <div ref={hoverCardRef} className={styles.hoverCard} aria-hidden="true">
        <div className={styles.hoverCardArt}>{SERVICE_PREVIEWS[preview]}</div>
        <div className={styles.hoverCardLabel}>
          {SERVICES_T[preview].name}
        </div>
      </div>

      <div className={styles.intro}>
        <div className="container">
          <Image
            src="/brand/lexma-digital-logo.png"
            alt="Lexma Digital Solutions"
            width={400}
            height={200}
            className={styles.brandLogo}
          />
          <div className={styles.introKicker}>{t.solutions.kicker}</div>
          <h2 className={`${styles.introTitle} h-display`}>
            {t.solutions.titlePre}
            <em>{t.solutions.titleEm}</em>
            {t.solutions.titlePost}
          </h2>
          <p className={styles.introSub}>{t.solutions.sub}</p>
        </div>
      </div>

      <div className={styles.list}>
        <div className="container">
          <div className={styles.listGrid}>
            <div className={styles.rail} aria-hidden="true">
              <div className={styles.railLine} />
              <div ref={railProgressRef} className={styles.railProgress} />
              <div
                ref={orbRef}
                className={`${styles.orb} ${styles.orbDocked}`}
              >
                <div className={styles.orbRing} />
                <div className={styles.orbBody} />
                <div className={styles.orbLens} />
                <div className={styles.orbPulse} />
              </div>
            </div>

            <div ref={listRef}>
          {SERVICES_T.map((s, i) => (
            <div
              key={SERVICES[i].name}
              className={`${styles.row} ${open === i ? styles.rowOpen + " " + styles.rowActive : ""}`}
            >
              <button
                className={styles.rowHead}
                onClick={() => setOpen(open === i ? -1 : i)}
                onMouseEnter={() => setPreview(i)}
                aria-expanded={open === i}
              >
                <span className={styles.num}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.chev}>+</span>
              </button>
              <div className={styles.body}>
                <div className={styles.bodyInner}>
                  <div className={styles.desc}>
                    {s.desc}
                    <div className={styles.quoteBtn}>
                      <Link
                        href={`/contact?service=${encodeURIComponent(SERVICES[i].name)}`}
                        className="btn btn-gold"
                      >
                        {t.solutions.quote}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
