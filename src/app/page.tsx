import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import PhotoServices from "@/components/PhotoServices";
import FeaturedWork from "@/components/FeaturedWork";
import Drone from "@/components/Drone";
import InteriorStrip from "@/components/InteriorStrip";
import Walkthrough from "@/components/Walkthrough";
import PhotographerScene from "@/components/PhotographerScene";
import Solutions from "@/components/Solutions";
import Outro from "@/components/Outro";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <PhotoServices />
        <Drone />
        <InteriorStrip />
        <Walkthrough />
        <PhotographerScene />
        <FeaturedWork />
        <Solutions />
        <Outro />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
