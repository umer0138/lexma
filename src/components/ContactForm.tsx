"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import styles from "@/app/contact/contact.module.css";

const SERVICES = [
  "Real Estate Photography",
  "Drone Photo / Video",
  "Virtual Staging",
  "Staging / Declutter & Photo Setup",
  "Airbnb Photography",
  "Commercial Photography",
  "Virtual Walkthrough",
  "Twilight / Signature Shots",
  "— Lexma Solutions —",
  "Website Design & Development",
  "Custom Business Software",
  "Automation Services",
  "Business Tool Integration",
  "AI Automation & Intelligent Workflows",
  "SEO & Google Ads",
  "Email Marketing Automation",
  "WhatsApp & CRM Automation",
  "Business Dashboards & Reports",
  "AI Business Assistants",
  "Other / Not sure yet",
];

function FormInner() {
  const params = useSearchParams();
  const { t } = useLang();
  const f = t.form;
  const preselect = params.get("service") || "";
  const sent = params.get("sent") === "1";
  const [service, setService] = useState(
    SERVICES.includes(preselect) ? preselect : ""
  );
  const [nextUrl, setNextUrl] = useState("https://lexmasolutions.com/contact?sent=1");
  useEffect(() => {
    setNextUrl(`${window.location.origin}/contact?sent=1`);
  }, []);

  return (
    <form
      className={styles.form}
      action="https://formsubmit.co/info@lexmasolutions.com"
      method="POST"
    >
      {/* formsubmit.co config */}
      <input type="hidden" name="_subject" value="New quote request — Lexma website" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={nextUrl} />

      {sent && <div className={styles.sent}>{f.sent}</div>}

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="name">{f.name}</label>
          <input id="name" name="name" required placeholder={f.namePh} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">{f.phone}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="(346) 000-0000"
          />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="email">{f.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="address">{f.address}</label>
          <input
            id="address"
            name="property_address"
            placeholder={f.addressPh}
          />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="service">{f.service}</label>
          <select
            id="service"
            name="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="" disabled>
              {f.servicePh}
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s} disabled={s.startsWith("—")}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="date">{f.date}</label>
          <input id="date" name="preferred_date" type="date" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">{f.message}</label>
        <textarea id="message" name="message" placeholder={f.messagePh} />
      </div>

      <button type="submit" className={`btn btn-gold ${styles.submit}`}>
        {f.submit}
      </button>
      <p className={styles.note}>{f.note}</p>
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={null}>
      <FormInner />
    </Suspense>
  );
}
