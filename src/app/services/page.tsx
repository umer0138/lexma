import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Solutions from "@/components/Solutions";
import Outro from "@/components/Outro";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services | Lexma — Real Estate Photography & Digital Solutions",
  description:
    "Lexma services: real estate photography, drone photo & video, virtual staging, Airbnb and commercial shoots, virtual walkthroughs — plus websites, automation and AI workflows from Lexma Solutions.",
};

const PHOTO_SERVICES = [
  {
    id: "photography",
    title: (
      <>
        Real Estate <em>Photography</em>
      </>
    ),
    desc: "The core of every listing: crisp, bright, magazine-grade photography that makes buyers stop scrolling and book a showing.",
    points: [
      "Interior & exterior coverage, every key room",
      "Professional editing on every photo",
      "Fast turnaround for active listings",
    ],
    img: "/images/service-01.jpg",
    alt: "Real estate photography by Lexma — Houston property exterior",
  },
  {
    id: "drone",
    title: (
      <>
        Drone <em>Photo & Video</em>
      </>
    ),
    desc: "Aerial perspectives that show the full story — lot size, neighborhood, amenities and location context that ground-level photos can't capture.",
    points: [
      "4K aerial photo and video",
      "Community, lot and amenity coverage",
      "Cinematic flyover edits for listings & social",
    ],
    img: "/images/aerials/DJI_0119.jpg",
    alt: "Aerial drone view of a Houston community with pool and lake",
  },
  {
    id: "staging",
    title: (
      <>
        Virtual Staging & <em>Declutter</em>
      </>
    ),
    desc: "Empty rooms become warm, styled spaces buyers can picture themselves in. Honest, tasteful staging that never misrepresents the property.",
    points: [
      "Furniture staging for vacant homes",
      "Declutter / photo setup guidance",
      "Natural, realistic results",
    ],
    img: "/images/interior/DSC_4449.jpg",
    alt: "Virtually staged living room with fireplace",
  },
  {
    id: "airbnb",
    title: (
      <>
        Airbnb & <em>Commercial</em>
      </>
    ),
    desc: "Listings that book faster and commercial spaces that close deals — shot for the platforms where they need to perform.",
    points: [
      "Airbnb / short-term rental shoots",
      "Office, retail and commercial spaces",
      "Platform-optimized formats",
    ],
    img: "/images/interior/DSC_6155.jpg",
    alt: "Airbnb condo interior with downtown Houston view",
  },
  {
    id: "walkthroughs",
    title: (
      <>
        Virtual <em>Walkthroughs</em>
      </>
    ),
    desc: "Immersive digital walkthroughs that let buyers explore the home from anywhere — a powerful edge for out-of-town and busy buyers.",
    points: [
      "Smooth room-to-room walkthrough videos",
      "Enhanced listing visual support",
      "Twilight & signature shots available",
    ],
    img: "/images/front/DSC_3287_Twilight.jpg",
    alt: "Twilight signature shot of a Houston home",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Services"
          title={
            <>
              Two crafts, <em>one goal:</em> make it move.
            </>
          }
          sub="Real estate media that sells properties, and digital systems that grow businesses. No fixed menus — every quote is tailored."
          bg="/images/front/DJI_0019.jpg"
        />

        {PHOTO_SERVICES.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`${styles.block} ${i % 2 ? styles.blockAlt : ""}`}
          >
            <div className="container">
              <Reveal
                className={`${styles.grid} ${i % 2 ? styles.gridFlip : ""}`}
                selector=":scope > *"
                stagger={0.15}
              >
                <div className={styles.media}>
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 860px) 92vw, 46vw"
                  />
                </div>
                <div>
                  <div className={styles.num}>
                    {String(i + 1).padStart(2, "0")} — Photography
                  </div>
                  <h2 className={`${styles.title} h-display`}>{s.title}</h2>
                  <p className={styles.desc}>{s.desc}</p>
                  <ul className={styles.points}>
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn btn-gold">
                    Request a Quote
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        ))}

        <Solutions />
        <Outro />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
