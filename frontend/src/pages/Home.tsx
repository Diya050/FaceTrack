import HeroSection from "../components/home/HeroSection.tsx";
import FeaturesSection from "../components/home/FeaturesSection.tsx";
import AdvantagesSection from "../components/home/AdvantagesSection.tsx";
import CTASection from "../components/home/CTASection.tsx";
import TestimonialsSection from "../components/home/TestimonialsSection.tsx";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AdvantagesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}