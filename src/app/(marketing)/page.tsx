import { ContactForm } from "@/components/website/contact-form";
import { HeroSlider } from "@/components/website/hero-slider";
import { ProjectsSection } from "@/components/website/projects-section";
import { ServicesSection } from "@/components/website/services-section";
import { WhyChooseUsFaqSection } from "@/components/website/why-choose-us-faq-section";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ServicesSection />
      <ProjectsSection />
      <WhyChooseUsFaqSection />
      <ContactForm />
    </>
  );
}
