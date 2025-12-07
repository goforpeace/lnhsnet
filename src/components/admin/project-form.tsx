"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";

const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  shortDescription: z.string().min(10, "Short description is required.").max(160),
  longDescription: z.string().min(20, "Long description is required."),
  status: z.enum(["Upcoming", "Ongoing", "Completed"]),
  landArea: z.string().min(1, "Land area is required."),
  totalFloors: z.coerce.number().int().positive(),
  parking: z.string().min(1, "Parking info is required."),
  elevator: z.string().min(1, "Elevator info is required."),
  googleMapsUrl: z.string().url("Must be a valid URL."),
  flatSizes: z.array(z.object({
    type: z.string().min(1, "Type is required."),
    sft: z.coerce.number().positive(),
    beds: z.coerce.number().int().positive(),
    verandas: z.coerce.number().int().nonnegative(),
    toilets: z.coerce.number().int().positive(),
  })).min(1, "At least one flat size is required."),
  imageUrls: z.array(z.object({
      url: z.string().url("Must be a valid URL.")
  })).min(1, "At least one image is required."),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: Project;
  formType: "create" | "edit";
}

export function ProjectForm({ project, formType }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const defaultValues: Partial<ProjectFormValues> = project ? {
      ...project,
      imageUrls: project.imageUrls.map(url => ({ url }))
  } : {
      title: "",
      shortDescription: "",
      longDescription: "",
      status: "Upcoming",
      flatSizes: [{ type: "A", sft: 1200, beds: 3, verandas: 2, toilets: 2 }],
      imageUrls: [{url: ""}]
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const { fields: flatSizeFields, append: appendFlatSize, remove: removeFlatSize } = useFieldArray({
      control: form.control,
      name: "flatSizes"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  async function onSubmit(data: ProjectFormValues) {
    if (!firestore) {
        toast({ title: "Error", description: "Firestore not available", variant: "destructive" });
        return;
    }
    
    const projectData = {
        ...data,
        imageUrls: data.imageUrls.map(img => img.url),
    };

    try {
        if (formType === 'create') {
            await addDocumentNonBlocking(collection(firestore, "projects"), projectData);
        } else if (project?.id) {
            await setDocumentNonBlocking(doc(firestore, "projects", project.id), projectData, { merge: true });
        }

        toast({
            title: `Project ${formType === 'create' ? 'Created' : 'Updated'}!`,
            description: `The project "${data.title}" has been successfully saved.`,
        });
        
        router.push("/cmi/projects");
        router.refresh(); // to reflect changes immediately
    } catch (error) {
        console.error("Error saving project: ", error);
        toast({
            title: "Error",
            description: "An error occurred while saving the project.",
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input placeholder="e.g., Landmark Heights" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="shortDescription" render={({ field }) => (
                    <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea placeholder="A brief, catchy description for the project card." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="longDescription" render={({ field }) => (
                    <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea placeholder="Detailed information about the project for its dedicated page." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Project Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="landArea" render={({ field }) => (
                    <FormItem><FormLabel>Project Land Area</FormLabel><FormControl><Input placeholder="e.g., 20 Katha" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="totalFloors" render={({ field }) => (
                    <FormItem><FormLabel>Total Floors</FormLabel><FormControl><Input type="number" placeholder="e.g., 14" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="parking" render={({ field }) => (
                    <FormItem><FormLabel>Parking</FormLabel><FormControl><Input placeholder="e.g., Available" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="elevator" render={({ field }) => (
                    <FormItem><FormLabel>Elevator</FormLabel><FormControl><Input placeholder="e.g., 2 Lifts" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="googleMapsUrl" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Google Maps Location</FormLabel><FormControl><Input type="url" placeholder="https://maps.app.goo.gl/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Flat Sizes</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendFlatSize({ type: "", sft: 0, beds: 0, verandas: 0, toilets: 0 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Size
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {flatSizeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 lg:grid-cols-6 gap-2 items-center p-2 rounded-md border">
                        <FormField control={form.control} name={`flatSizes.${index}.type`} render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="A" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <FormField control={form.control} name={`flatSizes.${index}.sft`} render={({ field }) => (
                            <FormItem><FormLabel>SFT</FormLabel><FormControl><Input type="number" placeholder="1200" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <FormField control={form.control} name={`flatSizes.${index}.beds`} render={({ field }) => (
                            <FormItem><FormLabel>Beds</FormLabel><FormControl><Input type="number" placeholder="3" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <FormField control={form.control} name={`flatSizes.${index}.verandas`} render={({ field }) => (
                            <FormItem><FormLabel>Verandas</FormLabel><FormControl><Input type="number" placeholder="2" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <FormField control={form.control} name={`flatSizes.${index}.toilets`} render={({ field }) => (
                            <FormItem><FormLabel>Toilets</FormLabel><FormControl><Input type="number" placeholder="2" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" className="lg:mt-6" onClick={() => removeFlatSize(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                {form.formState.errors.flatSizes && <FormMessage>{form.formState.errors.flatSizes.message}</FormMessage>}
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Project Images</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {imageFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`imageUrls.${index}.url`} render={({ field }) => (
                            <FormItem className="flex-grow"><FormLabel className="sr-only">Image URL</FormLabel><FormControl><Input type="url" placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage/></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                 {form.formState.errors.imageUrls && <FormMessage>{form.formState.errors.imageUrls.message}</FormMessage>}
            </CardContent>
        </Card>
        
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (formType === 'create' ? 'Create Project' : 'Save Changes')}
        </Button>
      </form>
    </Form>
  );
}
