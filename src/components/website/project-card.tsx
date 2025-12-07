
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
  
  const mainImage = project.imageUrls?.[0];
  const placeholder = mainImage ? PlaceHolderImages.find(p => p.imageUrl === mainImage) : null;
  const hint = placeholder?.imageHint ?? 'building';


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
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl h-full">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
            {mainImage ? (
                <Image
                    src={mainImage}
                    alt={`${project.title} main image`}
                    fill
                    className="object-cover"
                    data-ai-hint={hint}
                />
            ) : (
                <div className="bg-muted w-full h-full flex items-center justify-center">
                    <p className='text-muted-foreground'>No image available</p>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start mb-2">
            <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
            <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
        </div>
        <p className="text-muted-foreground line-clamp-3">{project.shortDescription}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
