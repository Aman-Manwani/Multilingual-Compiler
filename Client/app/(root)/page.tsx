import Header from "@/components/shared/Header";
import Hero from "@/components/frontPage/Hero";
import LogoCloud from "@/components/frontPage/LogoCloud";
import Feature from "@/components/frontPage/Feature";
import Stats from "@/components/frontPage/Stats";
import CtaSec from "@/components/frontPage/CtaSec";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="bg-gray-900">
      {/* header section  */}
      <Header />
      
      <main>
        {/* Hero section */}
        <Hero />

        {/* Logo cloud */}
        <LogoCloud />

        {/* Feature section */}
        <Feature />

        {/* Stats */}
        <Stats />

        {/* CTA section */}
        <CtaSec />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
