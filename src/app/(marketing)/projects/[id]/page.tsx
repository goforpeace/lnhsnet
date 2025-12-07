
"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ExternalLink, Building, Maximize, ParkingCircle, ArrowUpDown, MapPin, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const id = params.id;
    const projectRef = useMemoFirebase(
        () => (firestore && id ? doc(firestore, 'projects', id) : null),
        [firestore, id]
    );
    const { data: project, isLoading } = useDoc<Project>(projectRef);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            </div>
        );
    }
    
  if (!project && !isLoading) {
    notFound();
  }

  if (!project) {
    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-center items-center h-96">
                <p>Project not found.</p>
            </div>
        </div>
    );
  }

  const getStatusVariant = (status: Project['status']): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Ongoing': return 'secondary';
        case 'Upcoming': return 'destructive';
        default: return 'default';
    }
  };

  const projectDetails = [
    { icon: Building, label: "Total Floors", value: project.totalFloors },
    { icon: Maximize, label: "Land Area", value: project.landArea },
    { icon: ParkingCircle, label: "Parking", value: project.parking },
    { icon: ArrowUpDown, label: "Elevator", value: project.elevator },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{project.title}</h1>
            <Badge variant={getStatusVariant(project.status)} className="h-8 text-base">{project.status}</Badge>
        </div>
      </div>

      <Carousel className="w-full mb-12">
        <CarouselContent>
          {(project.imageUrls || []).map((url, index) => {
            const placeholder = PlaceHolderImages.find(p => p.imageUrl === url);
            const hint = placeholder?.imageHint ?? 'building interior';
            return (
              <CarouselItem key={index}>
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">About the Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{project.longDescription}</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Flat Sizes & Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Size (sft)</TableHead>
                                <TableHead className="text-right">Beds</TableHead>
                                <TableHead className="text-right">Verandas</TableHead>
                                <TableHead className="text-right">Toilets</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(project.flatSizes || []).map((size, index) => (
                                <TableRow key={size.type + index}>
                                    <TableCell className="font-medium">{size.type}</TableCell>
                                    <TableCell className="text-right">{size.sft.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{size.beds}</TableCell>
                                    <TableCell className="text-right">{size.verandas}</TableCell>
                                    <TableCell className="text-right">{size.toilets}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Project at a Glance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {projectDetails.map(detail => (
                        <div key={detail.label} className="flex items-center gap-4">
                            <detail.icon className="h-6 w-6 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold">{detail.label}</p>
                                <p className="text-muted-foreground">{detail.value}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <a href={project.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="mr-2 h-4 w-4" />
                            View on Google Maps
                            <ExternalLink className="ml-auto h-4 w-4" />
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
