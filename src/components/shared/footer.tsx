
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
             <Link href="/" className="flex items-center">
                <Image 
                    src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                    alt="Landmark New Homes Ltd. Logo"
                    width={120}
                    height={27}
                    className="object-contain h-auto w-auto"
                />
            </Link>
            <p className="text-sm text-muted-foreground">
              Where every square feet tells a story
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Address:</strong> House:4/C, Road:7/B, Sector:09 Uttara Dhaka</p>
            <div className="flex flex-col sm:flex-row justify-center sm:gap-4">
              <p><strong>Phone:</strong> <a href="tel:+8809649699499" className="hover:text-primary">+8809649-699499</a></p>
              <p><strong>Mobile:</strong> <a href="tel:+8801920709034" className="hover:text-primary">+8801920709034</a></p>
            </div>
            <p><strong>Email:</strong> <a href="mailto:info@landmarkltd.net" className="hover:text-primary">info@landmarkltd.net</a></p>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
