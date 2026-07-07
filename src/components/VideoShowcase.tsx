"use client";

import Reveal from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import styles from "./VideoShowcase.module.css";

/* ─────────────────────────────────────────────────────────────
   PASTE VIDEO LINKS HERE (Dropbox share links work as-is)
   Example: "https://www.dropbox.com/s/abc123/tour.mp4?dl=0"
   Leave "" to show the poster with a "coming soon" chip.
──────────────────────────────────────────────────────────────── */
const VIDEO_TOUR_URL = "/videos/video-tour.mp4";
const SOCIAL_REEL_URL = "/videos/social-reel.mp4";

/* Poster images shown before the video plays (swap freely) */
const VIDEO_TOUR_POSTER = "/images/tour-poster.jpg";
const SOCIAL_REEL_POSTER = "/images/reel-poster.jpg";
const ANIMATED_TOUR_POSTER = "/walkthrough/f001.webp";

/* Houston ambient background (subtle motion behind the section) */
const HOUSTON_BG_VIDEO = "/videos/houston-bg.mp4";
const HOUSTON_BG_POSTER = "/images/houston.jpg";

/* Converts a normal Dropbox share link into a direct-stream link */
const direct = (url: string) =>
  url
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace(/([?&])dl=0/, "$1raw=1");

function PlayerOrPoster({
  url,
  poster,
  vertical,
  comingSoon,
}: {
  url: string;
  poster: string;
  vertical?: boolean;
  comingSoon: string;
}) {
  if (url) {
    return (
      <video
        className={styles.video}
        src={direct(url)}
        poster={poster}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <div className={styles.poster}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" loading="lazy" />
      <div className={styles.playBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div className={styles.soonChip}>{comingSoon}</div>
      {vertical && <div className={styles.posterShade} />}
    </div>
  );
}

export default function VideoShowcase() {
  const { t } = useLang();
  const v = t.videos;

  const scrollToWalkthrough = () => {
    document
      .getElementById("walkthrough")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.wrap} aria-label="Video production showcase">
      {/* Houston skyline ambient motion background */}
      <div className={styles.bg} aria-hidden="true">
        <video
          className={styles.bgVideo}
          src={HOUSTON_BG_VIDEO}
          poster={HOUSTON_BG_POSTER}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.bgShade} />
      </div>

      <div className="container">
        <Reveal className={styles.head} selector=":scope > *" stagger={0.12}>
          <div className={styles.kicker}>{v.kicker}</div>
          <h2 className={`${styles.title} h-display`}>
            {v.titlePre}
            <em>{v.titleEm}</em>
          </h2>
          <p className={styles.sub}>{v.sub}</p>
        </Reveal>

        <Reveal className={styles.grid} selector=":scope > *" stagger={0.16}>
          {/* ── Video Tour (16:9) ── */}
          <article className={`${styles.card} ${styles.cardTour}`}>
            <div className={styles.mediaWide}>
              <PlayerOrPoster
                url={VIDEO_TOUR_URL}
                poster={VIDEO_TOUR_POSTER}
                comingSoon={v.comingSoon}
              />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.catNum}>01</span>
              <h3 className={styles.catLabel}>{v.cats.tour.label}</h3>
              <p className={styles.catDesc}>{v.cats.tour.desc}</p>
            </div>
          </article>

          {/* ── Social Media Reel (9:16 phone) ── */}
          <article className={`${styles.card} ${styles.cardReel}`}>
            <div className={styles.phone}>
              <div className={styles.phoneNotch} />
              <div className={styles.phoneScreen}>
                <PlayerOrPoster
                  url={SOCIAL_REEL_URL}
                  poster={SOCIAL_REEL_POSTER}
                  vertical
                  comingSoon={v.comingSoon}
                />
              </div>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.catNum}>02</span>
              <h3 className={styles.catLabel}>{v.cats.reel.label}</h3>
              <p className={styles.catDesc}>{v.cats.reel.desc}</p>
            </div>
          </article>

          {/* ── Animated Tour / Virtual Walkthrough ── */}
          <article className={`${styles.card} ${styles.cardAnimated}`}>
            <button
              type="button"
              className={styles.animatedMedia}
              onClick={scrollToWalkthrough}
              aria-label={v.cats.animated.cta}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ANIMATED_TOUR_POSTER} alt="" loading="lazy" />
              <div className={styles.animatedShade} />
              <span className={styles.animatedCta}>
                {v.cats.animated.cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </span>
            </button>
            <div className={styles.cardBody}>
              <span className={styles.catNum}>03</span>
              <h3 className={styles.catLabel}>{v.cats.animated.label}</h3>
              <p className={styles.catDesc}>{v.cats.animated.desc}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
