
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "../ui/button";
import Link from "next/link";


export function ReflectsSuccessSection() {
    const kitchenImage = PlaceHolderImages.find(p => p.id === 'project-1-kitchen');
    
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                A Home That Reflects Your Success!
                </h2>
                <div className="w-24 h-1 bg-accent my-6 mx-auto lg:mx-0"></div>
                <p className="text-lg text-muted-foreground">
                Experience unparalleled craftsmanship and timeless design in every corner of your new home. Our properties are more than just a residence; they are a statement of your achievements.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/#projects">View Our Portfolio</Link>
                </Button>
            </div>
            <div className="relative h-[350px] sm:h-[500px] lg:h-[600px] order-1 lg:order-2">
                {kitchenImage && (
                    <div className="absolute top-0 left-0 h-[85%] w-[85%] rounded-lg overflow-hidden shadow-2xl">
                        <Image
                        src={kitchenImage.imageUrl}
                        alt="Modern kitchen interior"
                        fill
                        className="object-cover"
                        data-ai-hint={kitchenImage.imageHint}
                        />
                    </div>
                )}
                 <div className="absolute bottom-0 right-0 h-[50%] w-[50%] rounded-lg overflow-hidden shadow-xl border-8 border-card bg-muted flex items-center justify-center">
                   <p className="font-headline text-lg text-muted-foreground p-4 text-center">Elegance in Every Detail</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
