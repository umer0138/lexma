import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ServiceGallery, { GalleryShot } from "@/components/ServiceGallery";
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

const PHOTO_SERVICES: {
  id: string;
  title: ReactNode;
  label: string;
  desc: string;
  points: string[];
  img: string;
  alt: string;
  img2?: string;
  alt2?: string;
  gallery: GalleryShot[];
}[] = [
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
    label: "Real Estate Photography",
    gallery: [
      { src: "/images/service-01.jpg", cap: "Front Elevation" },
      { src: "/images/front/DSC_7060.jpg", cap: "Modern Exterior" },
      { src: "/images/front/DSC_8695.jpg", cap: "Curb Appeal" },
      { src: "/images/interior/DSC_5074.jpg", cap: "Grand Entry" },
      { src: "/images/interior/DSC_5666.jpg", cap: "Family Room" },
      { src: "/images/front/DSC_4235.jpg", cap: "Classic Facade" },
    ],
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
    label: "Drone Photo & Video",
    gallery: [
      { src: "/images/aerials/DJI_0119.jpg", cap: "Community Aerial" },
      { src: "/images/aerials/DJI_0092.jpg", cap: "Estate From Above" },
      { src: "/images/aerials/DJI_0007.jpg", cap: "Neighborhood Context" },
      { src: "/images/aerials/DJI_0057.jpg", cap: "Lot & Land Coverage" },
      { src: "/images/houston.jpg", cap: "Downtown Houston" },
    ],
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
    img: "/images/staging/staging-03.jpg",
    img2: "/images/staging/staging-05.jpg",
    alt: "Virtually staged living room — photorealistic furniture rendering",
    alt2: "Virtually staged bedroom — realistic virtual staging example",
    label: "Virtual Staging",
    gallery: [
      { src: "/images/staging/staging-03.jpg", cap: "Living Room" },
      { src: "/images/staging/staging-05.jpg", cap: "Bedroom & Workspace" },
      { src: "/images/staging/staging-01.jpg", cap: "Home Office" },
      { src: "/images/staging/staging-02.jpg", cap: "Dining Area" },
      { src: "/images/staging/staging-04.jpg", cap: "Primary Bedroom" },
      { src: "/images/staging/staging-06.jpg", cap: "Guest Bedroom" },
    ],
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
    img: "/images/apt-living.jpg",
    alt: "Airbnb apartment living area with modern finishes — Houston",
    label: "Airbnb & Commercial",
    gallery: [
      { src: "/images/apt-living.jpg", cap: "Living Area" },
      { src: "/images/apt-kitchen.jpg", cap: "Designer Kitchen" },
      { src: "/images/apt-bedroom.jpg", cap: "Guest-Ready Bedroom" },
      { src: "/images/interior/DSC_6155.jpg", cap: "City-View Condo" },
    ],
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
    img: "/images/balcony-twilight.jpg",
    alt: "Signature balcony twilight shot over Houston at dusk",
    label: "Walkthroughs & Signature Shots",
    gallery: [
      { src: "/images/balcony-twilight.jpg", cap: "Balcony Twilight" },
      { src: "/images/front/DSC_3287_Twilight.jpg", cap: "Twilight Exterior" },
      { src: "/images/front/DSC_5654---Nightshot.jpg", cap: "Night Signature" },
      { src: "/images/hero-main.jpg", cap: "Aerial at Dusk" },
    ],
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
                <ServiceGallery
                  img={s.img}
                  alt={s.alt}
                  img2={s.img2}
                  alt2={s.alt2}
                  shots={s.gallery}
                  label={s.label}
                  hint="View Gallery"
                />
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
