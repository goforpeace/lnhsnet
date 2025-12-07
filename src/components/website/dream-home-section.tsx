
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function DreamHomeSection() {
    const livingRoomImage = PlaceHolderImages.find(p => p.id === 'project-1-living');
    const bedroomImage = PlaceHolderImages.find(p => p.id === 'project-2-bedroom');
    
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[350px] sm:h-[500px] lg:h-[600px]">
            {livingRoomImage && (
                <div className="absolute bottom-0 right-0 h-[85%] w-[85%] rounded-lg overflow-hidden shadow-2xl">
                    <Image
                    src={livingRoomImage.imageUrl}
                    alt="Luxurious living room"
                    fill
                    className="object-cover"
                    data-ai-hint={livingRoomImage.imageHint}
                    />
                </div>
            )}
            {bedroomImage && (
                <div className="absolute top-0 left-0 h-[50%] w-[50%] rounded-lg overflow-hidden shadow-xl border-8 border-background">
                    <Image
                    src={bedroomImage.imageUrl}
                    alt="Elegant bedroom"
                    fill
                    className="object-cover"
                    data-ai-hint={bedroomImage.imageHint}
                    />
                </div>
            )}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Your Dream Home Awaits!
            </h2>
            <div className="w-24 h-1 bg-accent my-6 mx-auto lg:mx-0"></div>
            <p className="text-lg text-muted-foreground">
              Discover the perfect blend of comfort and luxury with our
              exclusive apartments designed to elevate your lifestyle.
            </p>
            <p className="mt-4 text-muted-foreground">
              Secure a modern, elegant flat in a prime location and watch
              your investment grow with Landmark Estates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
