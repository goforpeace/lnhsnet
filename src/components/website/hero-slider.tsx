
"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import SplitText from "../ui/split-text";


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  phone: z.string().min(10, { message: 'A valid phone number is required.' }),
});

interface HeroSliderProps {
    heroImages: HeroImage[];
    isLoading: boolean;
}

export function HeroSlider({ heroImages, isLoading }: HeroSliderProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnHover: true })
  );
  
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', phone: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Database not connected. Please try again later.',
      });
      return;
    }

    try {
      const requestData = {
        ...values,
        projectId: 'N/A',
        projectName: 'General Inquiry from Homepage',
        submissionDate: serverTimestamp(),
        status: 'New'
      };

      await addDocumentNonBlocking(collection(firestore, "call_requests"), requestData);

      toast({
        title: 'Request Sent!',
        description: 'We have received your request and will call you back shortly.',
      });
      form.reset();
      setDialogOpen(false);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "An error occurred while submitting your request. Please try again.",
      });
    }
  }


  if (isLoading) {
    return <Skeleton className="w-full h-[60vh] md:h-[80vh]" />;
  }

  return (
    <section className="w-full">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                      <SplitText
                        text="Where every square feet tells a story"
                        tag="h1"
                        className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-2xl"
                        delay={50}
                        duration={0.8}
                        splitType="chars, words"
                      />
                      <h2 className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-lg">
                        Crafting homes that are a testament to quality and a promise of a better life.
                      </h2>
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="bg-primary/80 hover:bg-primary border-primary-foreground/50 border">
                          <Link href="/#projects">Explore Properties</Link>
                        </Button>
                         <DialogTrigger asChild>
                            <Button variant="outline" className="border-primary-foreground/50 bg-transparent hover:bg-primary/20 text-white">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Request a Call
                            </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Call Back</DialogTitle>
              <DialogDescription>
                Provide your details and we'll call you back to discuss your needs.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
      </Dialog>
    </section>
  );
}
