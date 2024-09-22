import Hero from "@/components/frontPage/Hero";
import LogoCloud from "@/components/frontPage/LogoCloud";
import Feature from "@/components/frontPage/Feature";
import Stats from "@/components/frontPage/Stats";
import CtaSec from "@/components/frontPage/CtaSec";

export default function Home() {
  return (
    <div className="bg-gray-900">
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
    </div>
  );
}
