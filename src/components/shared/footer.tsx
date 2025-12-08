
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl py-12">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-4">
             <Link href="/" className="flex items-center">
                <Image 
                    src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                    alt="Landmark New Homes Ltd. Logo"
                    width={180}
                    height={40}
                    className="object-contain h-12 w-auto"
                />
            </Link>
            <div className="flex flex-col border-l pl-4">
              <p className="text-sm text-muted-foreground">
                Where every square feet tells a story
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
