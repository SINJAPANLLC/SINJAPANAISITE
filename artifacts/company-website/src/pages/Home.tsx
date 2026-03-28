import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoSlider } from "@/components/LogoSlider";
import { Services } from "@/components/Services";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { CaseStudies } from "@/components/CaseStudies";
import { News } from "@/components/News";
import { Partners } from "@/components/Partners";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoSlider />
        <Services />
        <Features />
        <Stats />
        <CaseStudies />
        <News />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
