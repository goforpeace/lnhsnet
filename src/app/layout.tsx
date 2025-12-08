
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { firestore } from '@/firebase/server-admin'; // Server-side firestore

// This function fetches SEO data on the server at build time
async function getSeoData() {
  if (!firestore) {
    return {
      title: 'Landmark New Homes Ltd.',
      description: 'Where every square feet tells a story',
    };
  }
  try {
    const seoDoc = await firestore.collection('seo_settings').doc('global').get();
    if (seoDoc.exists) {
      const seoData = seoDoc.data();
      return {
        title: seoData?.metaTitle || 'Landmark New Homes Ltd.',
        description: seoData?.metaDescription || 'Where every square feet tells a story',
        keywords: seoData?.metaKeywords,
        openGraph: {
          title: seoData?.metaTitle,
          description: seoData?.metaDescription,
          images: seoData?.ogImageUrl ? [seoData.ogImageUrl] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Could not fetch SEO settings from Firestore:", error);
  }
  
  // Default values
  return {
    title: 'Landmark New Homes Ltd.',
    description: 'Where every square feet tells a story',
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return {
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: seo.openGraph,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
