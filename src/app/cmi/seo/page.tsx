
"use client";

import { SeoForm } from "@/components/admin/seo-form";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SEOSettings } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function SeoSettingsPage() {
  const firestore = useFirestore();
  
  // We fetch a single document with a known ID 'global' for site-wide settings.
  const seoSettingsRef = firestore ? doc(firestore, 'seo_settings', 'global') : null;
  const { data: seoSettings, isLoading } = useDoc<SEOSettings>(seoSettingsRef);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Site-Wide SEO Settings</h1>
        <p className="text-muted-foreground">Manage the default SEO metadata for your entire website.</p>
      </div>
       {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <SeoForm initialData={seoSettings} />
      )}
    </div>
  );
}
