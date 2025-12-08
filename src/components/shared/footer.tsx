
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl py-12">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
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
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
