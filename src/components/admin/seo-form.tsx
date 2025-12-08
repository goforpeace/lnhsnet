
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SEOSettings } from "@/lib/types";

const seoFormSchema = z.object({
  metaTitle: z.string().min(3, "Meta title must be at least 3 characters long."),
  metaDescription: z.string().min(10, "Meta description must be at least 10 characters long.").max(160, "Meta description should not exceed 160 characters."),
  metaKeywords: z.string().optional(),
  ogImageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

interface SeoFormProps {
  initialData?: SEOSettings | null;
}

export function SeoForm({ initialData }: SeoFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const defaultValues: SeoFormValues = {
    metaTitle: initialData?.metaTitle || 'Landmark New Homes Ltd.',
    metaDescription: initialData?.metaDescription || 'Where every square feet tells a story',
    metaKeywords: initialData?.metaKeywords || 'real estate, luxury apartments, new homes',
    ogImageUrl: initialData?.ogImageUrl || '',
  };

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: SeoFormValues) {
    if (!firestore) {
      toast({ title: "Error", description: "Firestore not available", variant: "destructive" });
      return;
    }

    try {
      const settingsRef = doc(firestore, 'seo_settings', 'global');
      await setDocumentNonBlocking(settingsRef, data, { merge: true });

      toast({
        title: "SEO Settings Updated!",
        description: "Your site-wide SEO settings have been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving SEO settings: ", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the settings.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Meta Tags</CardTitle>
            <FormDescription className="pt-2">These are the default SEO settings for your website. They can be overridden by page-specific settings.</FormDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Website's Main Title" {...field} />
                  </FormControl>
                  <FormDescription>The default title that appears in the browser tab and search engine results.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary of your website for search engines." {...field} />
                  </FormControl>
                  <FormDescription>Aim for 50-160 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., real estate, luxury apartments, property" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated keywords that are relevant to your business.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Social Media Sharing</CardTitle>
                 <FormDescription className="pt-2">Set how your website looks when shared on social media platforms like Facebook or Twitter.</FormDescription>
            </CardHeader>
            <CardContent>
                 <FormField
                    control={form.control}
                    name="ogImageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Open Graph Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/social-image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>The default image to show when your site is shared. Recommended size: 1200x630 pixels.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </Form>
  );
}
