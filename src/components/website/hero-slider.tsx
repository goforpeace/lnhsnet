"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
                      Landmark New Homest Ltd
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-lg">
                      Where every square feet tells a story
                    </p>
                    <Button size="lg" className="mt-8 bg-primary/80 hover:bg-primary border-primary-foreground/50 border">
                      Explore Properties
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <CarouselPrevious className="static translate-y-0 text-white bg-white/10 hover:bg-white/20 border-white/20" />
            <CarouselNext className="static translate-y-0 text-white bg-white/10 hover:bg-white/20 border-white/20" />
        </div>
      </Carousel>
    </section>
  );
}
