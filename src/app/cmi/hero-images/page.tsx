"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeroImage } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";

export default function HeroImagesPage() {
  const firestore = useFirestore();
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  const heroImagesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, "hero_images"), orderBy("order", "asc")) : null,
    [firestore]
  );
  const { data: images, isLoading } = useCollection<HeroImage>(heroImagesQuery);

  const handleAddImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    
    const form = event.currentTarget;
    const urlInput = form.elements.namedItem("url") as HTMLInputElement;
    const altInput = form.elements.namedItem("alt") as HTMLInputElement;
    
    const newImage = {
      imageUrl: urlInput.value,
      altText: altInput.value,
      order: images ? images.length : 0,
    };
    
    addDocumentNonBlocking(collection(firestore, "hero_images"), newImage);
    setDialogOpen(false);
    form.reset();
  };

  const handleDeleteImage = (id: string) => {
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, "hero_images", id));
  };

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">Hero Images</h1>
                <p className="text-muted-foreground">Manage images for the homepage slider.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Hero Image</DialogTitle>
                  <DialogDescription>
                    Enter the URL and alt text for the new image.
                  </DialogDescription>
                </DialogHeader>
                <form id="add-image-form" onSubmit={handleAddImage} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">Image URL</Label>
                    <Input id="url" name="url" placeholder="https://example.com/image.jpg" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alt" className="text-right">Alt Text</Label>
                    <Input id="alt" name="alt" placeholder="Description of the image" className="col-span-3" required />
                  </div>
                </form>
                <DialogFooter>
                    <Button type="submit" form="add-image-form">Add Image</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Image List</CardTitle>
          <CardDescription>
            A list of all images currently in the hero slider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                images?.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <Image
                      src={image.imageUrl}
                      alt={image.altText}
                      width={80}
                      height={45}
                      className="rounded-md object-cover aspect-video"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{image.altText}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-xs">{image.imageUrl}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteImage(image.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
