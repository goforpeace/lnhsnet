
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ProjectCard } from "./project-card";
import type { Project } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProjectsSectionProps {
    projects: Project[];
    isLoading: boolean;
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true, stopOnHover: true })
    );

  return (
    <section id="projects" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A glimpse into our commitment to excellence.
          </p>
        </div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.play}
        >
          <CarouselContent className="-ml-4">
            {(isLoading ? Array.from({ length: 3 }) : projects).map((project, i) => (
              <CarouselItem key={isLoading ? i : project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                 <div className="p-1 h-full">
                    <ProjectCard project={project as Project} isLoading={isLoading} />
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-1rem] sm:left-[-2.5rem]" />
          <CarouselNext className="right-[-1rem] sm:right-[-2.5rem]" />
        </Carousel>
      </div>
    </section>
  );
}
