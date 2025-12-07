"use client";

import { ContactForm } from "@/components/website/contact-form";
import { HeroSlider } from "@/components/website/hero-slider";
import { ProjectsSection } from "@/components/website/projects-section";
import { ServicesSection } from "@/components/website/services-section";
import { WhyChooseUsFaqSection } from "@/components/website/why-choose-us-faq-section";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { HeroImage, Project } from "@/lib/types";

export default function HomePage() {
  const firestore = useFirestore();

  const heroImagesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, "hero_images"), orderBy("order", "asc"))
        : null,
    [firestore]
  );
  const { data: heroImages, isLoading: heroImagesLoading } =
    useCollection<HeroImage>(heroImagesQuery);

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "projects")) : null),
    [firestore]
  );
  const { data: projects, isLoading: projectsLoading } =
    useCollection<Project>(projectsQuery);

  return (
    <>
      <HeroSlider heroImages={heroImages ?? []} isLoading={heroImagesLoading} />
      <ServicesSection />
      <ProjectsSection projects={projects ?? []} isLoading={projectsLoading} />
      <WhyChooseUsFaqSection />
      <ContactForm />
    </>
  );
}
