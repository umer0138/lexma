import Image from "next/image";
import { ReactNode } from "react";
import Reveal from "./Reveal";
import styles from "./PageHero.module.css";

export default function PageHero({
  kicker,
  title,
  sub,
  bg,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  bg?: string;
}) {
  return (
    <section className={styles.hero}>
      {bg && (
        <div className={styles.bg}>
          <Image src={bg} alt="" fill sizes="100vw" priority />
        </div>
      )}
      <div className="container">
        <Reveal className={styles.inner} selector=":scope > *" stagger={0.12}>
          <div className={styles.kicker}>{kicker}</div>
          <h1 className={`${styles.title} h-display`}>{title}</h1>
          {sub && <p className={styles.sub}>{sub}</p>}
        </Reveal>
      </div>
    </section>
  );
}
