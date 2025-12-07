
"use client";

import type { Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MapPin, Eye } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "../ui/badge";

interface FeaturedProjectSectionProps {
  project?: Project;
  isLoading: boolean;
}

export function FeaturedProjectSection({ project, isLoading }: FeaturedProjectSectionProps) {

  if (isLoading) {
    return (
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-96 w-full rounded-lg" />
            </div>
      </section>
    )
  }

  if (!project) {
    return null; // Don't render the section if there's no featured project
  }

  const mainImage = project.imageUrls?.[0];
  const placeholder = mainImage ? PlaceHolderImages.find(p => p.imageUrl === mainImage) : null;
  const hint = placeholder?.imageHint ?? 'building';
  
  const getStatusVariant = (status: Project['status']): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Ongoing': return 'secondary';
        case 'Upcoming': return 'destructive';
        default: return 'default';
    }
  };


  return (
    <section id="featured-project" className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Project</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                An exclusive look into our premier property.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                {mainImage ? (
                     <Image
                        src={mainImage}
                        alt={`Image of ${project.title}`}
                        fill
                        className="object-cover"
                        data-ai-hint={hint}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Image not available</p>
                    </div>
                )}
                <Badge variant={getStatusVariant(project.status)} className="absolute top-4 right-4 text-base">{project.status}</Badge>
            </div>
            <div>
                <h3 className="font-headline text-4xl font-bold text-primary">{project.title}</h3>
                <p className="mt-4 text-lg text-muted-foreground">{project.shortDescription}</p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={`/project/${project.id}`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                         <Link href="/#projects">
                            <Eye className="mr-2 h-4 w-4" />
                            View Other Projects
                        </Link>
                    </Button>
                    {project.googleMapsUrl && (
                        <Button variant="secondary" asChild>
                             <a href={project.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4" />
                                View Location
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
