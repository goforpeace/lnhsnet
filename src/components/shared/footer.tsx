
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Facebook, Youtube, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <Link href="/" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png"
                alt="Landmark New Homes Ltd. Logo"
                width={150}
                height={34}
                className="object-contain h-auto w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Where every square feet tells a story
            </p>
          </div>

          {/* Right Column: Contact Info & Socials */}
          <div className="flex flex-col items-center md:items-start text-sm text-muted-foreground space-y-3 text-center md:text-left">
            <h3 className="font-semibold text-lg text-foreground">Contact Us</h3>
            <p><strong>Address:</strong> House:4/C, Road:7/B, Sector:09 Uttara Dhaka</p>
            <p><strong>Phone:</strong> <a href="tel:+8809649699499" className="hover:text-primary transition-colors">+8809649-699499</a></p>
            <p><strong>Mobile:</strong> <a href="tel:+8801920709034" className="hover:text-primary transition-colors">+8801920709034</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@landmarkltd.net" className="hover:text-primary transition-colors">info@landmarkltd.net</a></p>
            <div className="flex space-x-4 pt-4">
                <a href="https://facebook.com/landmarkltd.net" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-6 w-6" />
                    <span className="sr-only">Facebook</span>
                </a>
                <a href="https://wa.me/8801920709034" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <MessageSquare className="h-6 w-6" />
                    <span className="sr-only">WhatsApp</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Youtube className="h-6 w-6" />
                    <span className="sr-only">YouTube</span>
                </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
