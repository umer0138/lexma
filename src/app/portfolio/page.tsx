import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import PortfolioGallery from "@/components/PortfolioGallery";
import Outro from "@/components/Outro";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Portfolio | Lexma Real Estate Photography — Houston",
  description:
    "Browse Lexma's real estate photography portfolio: aerial drone shots, twilight exteriors, and staged interiors across the Greater Houston Area.",
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Portfolio"
          title={
            <>
              Every frame, <em>built to sell.</em>
            </>
          }
          sub="Aerials, exteriors, interiors and staging from real Houston-area shoots. Click any photo to view it full screen."
          bg="/images/aerials/DJI_0092.jpg"
        />
        <PortfolioGallery />
        <Outro />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
