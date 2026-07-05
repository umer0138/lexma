import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | Lexma — Request a Quote",
  description:
    "Request a quote from Lexma: real estate photography, drone media, virtual staging, websites and automation. Serving the Greater Houston Area. Call, WhatsApp or send the form.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Contact"
          title={
            <>
              Let&apos;s get you <em>a quote.</em>
            </>
          }
          sub="Tell us what you need — property shoot or digital project — and we'll reply fast with a tailored quote."
          bg="/images/aerials/DJI_0040.jpg"
        />

        <section className={styles.wrap}>
          <div className="container">
            <Reveal className={styles.grid} selector=":scope > *" stagger={0.15}>
              <ContactForm />

              <div className={styles.info}>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Call or Text</div>
                  <a href="tel:+13465586955">346-558-6955</a>
                  <a href="tel:+13465586963">346-558-6963</a>
                  <p className={styles.cardSub}>
                    Both numbers work for WhatsApp, calls and text.
                  </p>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardTitle}>Email</div>
                  <a href="mailto:info@lexmasolutions.com">
                    info@lexmasolutions.com
                  </a>
                  <p className={styles.cardSub}>
                    Quotes, inquiries, and project references / inspiration
                    files — send everything here.
                  </p>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardTitle}>Follow</div>
                  <a
                    href="https://www.instagram.com/lexmasolutions/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram — @lexmasolutions
                  </a>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardTitle}>Service Area</div>
                  <p>Greater Houston Area, TX</p>
                  <p className={styles.cardSub}>
                    Outside the area? Contact us to confirm coverage for your
                    property&apos;s location.
                  </p>
                </div>

                <div className={styles.map}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443088.0092130744!2d-95.68717546874999!3d29.817478000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lexma service area — Greater Houston"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
