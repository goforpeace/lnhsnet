
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "../ui/skeleton";

interface ProjectCardProps {
  project: Project;
  isLoading?: boolean;
}

export function ProjectCard({ project, isLoading }: ProjectCardProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnHover: true })
  );

  if (isLoading || !project?.id) {
      return (
          <Card className="flex flex-col overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
              </CardFooter>
          </Card>
      );
  }

  const getStatusVariant = (status: Project['status']): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Completed':
            return 'default';
        case 'Ongoing':
            return 'secondary';
        case 'Upcoming':
            return 'destructive';
        default:
            return 'default';
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.play}
        >
          <CarouselContent>
            {project.imageUrls.map((url, index) => {
              const placeholder = PlaceHolderImages.find(p => p.imageUrl === url);
              const hint = placeholder?.imageHint ?? 'building';
              return (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <Image
                      src={url}
                      alt={`${project.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={hint}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start mb-2">
            <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
            <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
        </div>
        <p className="text-muted-foreground line-clamp-3">{project.shortDescription}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
