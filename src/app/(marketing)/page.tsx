
"use client";

import { ContactForm } from "@/components/website/contact-form";
import { HeroSlider } from "@/components/website/hero-slider";
import { ProjectsSection } from "@/components/website/projects-section";
import { ServicesSection } from "@/components/website/services-section";
import { WhyChooseUsFaqSection } from "@/components/website/why-choose-us-faq-section";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, where, limit } from "firebase/firestore";
import type { HeroImage, Project } from "@/lib/types";
import { DreamHomeSection } from "@/components/website/dream-home-section";
import { ReflectsSuccessSection } from "@/components/website/reflects-success-section";
import { FeaturedProjectSection } from "@/components/website/featured-project-section";
import AnimatedContent from "@/components/ui/animated-content";

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

  const featuredProjectQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, "projects"), where("isFeatured", "==", true), limit(1)) : null,
    [firestore]
  );
  const { data: featuredProjectData, isLoading: featuredProjectLoading } = useCollection<Project>(featuredProjectQuery);
  const featuredProject = featuredProjectData?.[0];

  return (
    <>
      <HeroSlider heroImages={heroImages ?? []} isLoading={heroImagesLoading} />
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <FeaturedProjectSection project={featuredProject} isLoading={featuredProjectLoading} />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <ServicesSection />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <DreamHomeSection />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <ProjectsSection projects={projects ?? []} isLoading={projectsLoading} />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <ReflectsSuccessSection />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <WhyChooseUsFaqSection />
      </AnimatedContent>
      <AnimatedContent distance={150} duration={1.2} delay={0.3}>
        <ContactForm />
      </AnimatedContent>
    </>
  );
}
