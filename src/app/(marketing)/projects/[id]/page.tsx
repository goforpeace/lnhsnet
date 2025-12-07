
"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Building, Maximize, ParkingCircle, ArrowUpDown, MapPin, Loader2, Bed, Bath, Triangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LetUsDiscussSection } from '@/components/website/let-us-discuss-section';

// Add ID to the project type
type ProjectWithId = Project & { id: string };

export default function ProjectDetailPage({ params }: { params: { id:string } }) {
    const firestore = useFirestore();
    const id = params.id;

    const [project, setProject] = useState<ProjectWithId | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    useEffect(() => {
        if (!firestore || !id) {
            setIsLoading(false);
            setError("Firestore not available or ID is missing.");
            return;
        }

        const projectRef = doc(firestore, 'projects', id);
        
        setIsLoading(true);
        setProject(null);
        setError(null);

        const unsubscribe = onSnapshot(projectRef, 
            (snapshot: DocumentSnapshot<DocumentData>) => {
                if (snapshot.exists()) {
                    setProject({ id: snapshot.id, ...snapshot.data() } as ProjectWithId);
                } else {
                    setError("Project not found.");
                }
                setIsLoading(false);
            }, 
            (err) => {
                console.error("Error fetching project:", err);
                setError("Failed to load project details.");
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [firestore, id]);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <span className="sr-only">Loading project...</span>
            </div>
        );
    }
    
    if (error || !project) {
        notFound();
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
    
    const mainImage = project.imageUrls?.[0];
    const galleryImages = project.imageUrls?.slice(1);

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{project.title}</h1>
                    <Badge variant={getStatusVariant(project.status)} className="h-8 text-base">{project.status}</Badge>
                </div>
            </div>

            {/* Main Content: Image + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Left Column: Main Image */}
                <div 
                    className="relative aspect-[3/4] w-full h-full rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                    onClick={() => mainImage && handleImageClick(mainImage)}
                >
                    {mainImage ? (
                        <>
                            <Image
                                src={mainImage}
                                alt={`${project.title} main image`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority
                                data-ai-hint={'building exterior'}
                            />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize className="h-12 w-12 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="bg-muted w-full h-full flex items-center justify-center">
                           <p className='text-muted-foreground'>No image available</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h2 className="font-headline text-2xl font-semibold mb-2">About the Project</h2>
                        <p className="text-muted-foreground">{project.shortDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {projectDetails.map(detail => (
                            detail.value ? (
                                <div key={detail.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                                    <detail.icon className="h-5 w-5 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">{detail.label}</p>
                                        <p className="text-muted-foreground text-sm">{detail.value}</p>
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>

                     {project.googleMapsUrl && (
                        <Button asChild className="w-full">
                            <a href={project.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4" />
                                View on Google Maps
                                <ExternalLink className="ml-auto h-4 w-4" />
                            </a>
                        </Button>
                    )}
                    
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Flat Configurations</h3>
                        <Accordion type="single" collapsible className="w-full">
                            {(project.flatSizes || []).map((size, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className='font-semibold'>Type {size.type} - {size.sft} sft</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                                            <Bed className="h-5 w-5 text-primary"/>
                                            <span className="text-sm font-medium">{size.beds} Beds</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                                            <Bath className="h-5 w-5 text-primary"/>
                                            <span className="text-sm font-medium">{size.toilets} Toilets</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                                            <Triangle className="h-5 w-5 text-primary rotate-180"/>
                                            <span className="text-sm font-medium">{size.verandas} Verandas</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>

            {/* Let's Discuss Section */}
            <LetUsDiscussSection projectId={project.id} projectName={project.title} />

            {/* Gallery Section */}
            {(galleryImages && galleryImages.length > 0) && (
                <div className='mt-16'>
                    <h2 className="font-headline text-3xl font-bold mb-8 text-center">Project Gallery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryImages.map((url, index) => (
                            <div 
                                key={index} 
                                className="relative aspect-video rounded-lg overflow-hidden shadow-md group cursor-pointer"
                                onClick={() => handleImageClick(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`${project.title} gallery image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint="building interior"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Card className='mt-16'>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Detailed Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{project.longDescription}</p>
                </CardContent>
            </Card>

            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-4xl w-full p-2 bg-transparent border-0">
                    {selectedImage && (
                        <div className="relative aspect-video w-full">
                            <Image
                                src={selectedImage}
                                alt="Full screen project image"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
