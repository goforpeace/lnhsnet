
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { HeroImage } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSliderProps {
    heroImages: HeroImage[];
    isLoading: boolean;
}

export function HeroSlider({ heroImages, isLoading }: HeroSliderProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnHover: true })
  );

  if (isLoading) {
    return <Skeleton className="w-full h-[60vh] md:h-[80vh]" />;
  }

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {heroImages.map((image, index) => {
            const placeholder = PlaceHolderImages.find(p => p.imageUrl === image.imageUrl);
            const hint = placeholder ? placeholder.imageHint : image.altText.toLowerCase().split(' ').slice(0, 2).join(' ');
            
            return (
              <CarouselItem key={index} className="pl-0">
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={hint}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-2xl">
                      Where every square feet tells a story
                    </h1>
                    <h2 className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-lg">
                      Crafting homes that are a testament to quality and a promise of a better life.
                    </h2>
                    <Button asChild size="lg" className="mt-8 bg-primary/80 hover:bg-primary border-primary-foreground/50 border">
                      <Link href="/#projects">Explore Properties</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
