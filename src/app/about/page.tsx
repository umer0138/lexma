import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Outro from "@/components/Outro";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | Lexma — Real Estate Photography & Digital Solutions",
  description:
    "Lexma is a Houston-area real estate media and digital solutions studio. Photography, drone, staging and walkthroughs — plus websites and automation under Lexma Solutions.",
};

const STEPS = [
  {
    t: "Reach Out",
    d: "Call, WhatsApp or send the quote form — tell us about your property or project.",
  },
  {
    t: "Get Your Quote",
    d: "We reply fast with a tailored quote based on exactly what you need. No fixed menus.",
  },
  {
    t: "We Shoot / Build",
    d: "Photography scheduled around your listing — or your digital project kicked off with clear milestones.",
  },
  {
    t: "You Get Results",
    d: "Polished media delivered fast, or a digital system that starts working for your business from day one.",
  },
];

const VALUES = [
  {
    icon: "◈",
    t: "Quality First",
    d: "Every photo professionally edited, every pixel deliberate. Work we're proud to sign.",
  },
  {
    icon: "✦",
    t: "Speed Matters",
    d: "Listings can't wait. Fast turnarounds without cutting corners.",
  },
  {
    icon: "◎",
    t: "Honest Media",
    d: "Staging and enhancements that flatter the property — never misrepresent it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="About Lexma"
          title={
            <>
              The studio behind <em>the shots.</em>
            </>
          }
          sub="Real estate media and digital solutions, built in Houston for the people who move it."
          bg="/images/front/DSC_5654---Nightshot.jpg"
        />

        <section className={styles.story}>
          <div className="container">
            <Reveal className={styles.storyGrid} selector=":scope > *" stagger={0.15}>
              <div>
                <p className={`${styles.statement} h-display`}>
                  Lexma exists because <em>great properties deserve great presentation</em> — and because the businesses selling them deserve tools that work as hard as they do.
                </p>
                <div className={styles.storyText} style={{ marginTop: 26 }}>
                  <p>
                    We started behind the camera: photographing Houston-area
                    homes, flying drones over communities, and staging empty
                    rooms into spaces buyers fall for. That craft — Lexma Real
                    Estate Photography — is still the heart of the studio.
                  </p>
                  <p>
                    Along the way, our clients kept asking for more: websites,
                    booking systems, automated follow-ups. So we built Lexma
                    Solutions — the digital side of the house — where the same
                    obsession with detail goes into code, automation and AI
                    workflows.
                  </p>
                  <p>
                    Today, one studio covers both: the media that sells the
                    property, and the systems that grow the business.
                  </p>
                </div>
              </div>
              <div className={styles.media}>
                <Image
                  src="/images/interior/DSC_5074.jpg"
                  alt="Staged Houston home interior photographed by Lexma"
                  fill
                  sizes="(max-width: 900px) 92vw, 42vw"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.process}>
          <div className="container">
            <Reveal>
              <div className={styles.kicker}>How It Works</div>
              <h2 className={`${styles.title} h-display`}>
                Simple process, <em>serious results.</em>
              </h2>
            </Reveal>
            <Reveal className={styles.steps} selector=":scope > *" stagger={0.12}>
              {STEPS.map((s, i) => (
                <div key={s.t} className={styles.step}>
                  <div className={styles.stepNum}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className={styles.stepTitle}>{s.t}</div>
                  <div className={styles.stepDesc}>{s.d}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className={styles.values}>
          <div className="container">
            <Reveal className={styles.valueRow} selector=":scope > *" stagger={0.12}>
              {VALUES.map((v) => (
                <div key={v.t} className={styles.value}>
                  <div className={styles.valueIcon}>{v.icon}</div>
                  <div className={styles.valueTitle}>{v.t}</div>
                  <div className={styles.valueDesc}>{v.d}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <Outro />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
