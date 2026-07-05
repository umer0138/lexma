import type { Metadata } from "next";
import { Instrument_Sans, Cormorant_Garamond, Fraunces } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Lexma Real Estate Photography | Greater Houston Area",
  description:
    "Lexma Real Estate Photography — professional property photography, drone media, virtual staging and walkthroughs in the Greater Houston Area. Plus Lexma Solutions: websites, automation and digital services for business. Request a quote today.",
  keywords: [
    "Lexma",
    "real estate photography Houston",
    "drone photography Houston",
    "virtual staging",
    "Airbnb photography",
    "commercial photography",
    "Lexma Solutions",
  ],
  openGraph: {
    title: "Lexma Real Estate Photography | Showcase. Impress. Sell.",
    description:
      "Professional real estate media and digital solutions serving the Greater Houston Area.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${cormorant.variable} ${fraunces.variable}`}
    >
      <body>
        <LanguageProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
