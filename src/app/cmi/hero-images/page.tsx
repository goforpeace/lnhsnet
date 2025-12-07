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
import { heroImages as initialHeroImages } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
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

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>(initialHeroImages);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const urlInput = form.elements.namedItem("url") as HTMLInputElement;
    const altInput = form.elements.namedItem("alt") as HTMLInputElement;
    const newImage: HeroImage = {
      id: Date.now().toString(),
      url: urlInput.value,
      alt: altInput.value,
    };
    setImages((prev) => [...prev, newImage]);
    setDialogOpen(false);
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
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
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={80}
                      height={45}
                      className="rounded-md object-cover aspect-video"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{image.alt}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-xs">{image.url}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
