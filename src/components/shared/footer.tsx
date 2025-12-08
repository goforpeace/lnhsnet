
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl py-12">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
             <Link href="/" className="flex items-center">
                <Image 
                    src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                    alt="Landmark New Homes Ltd. Logo"
                    width={200}
                    height={45}
                    className="object-contain h-auto w-auto"
                />
            </Link>
            <p className="text-sm text-muted-foreground">
              Where every square feet tells a story
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} Landmark New Homes Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
