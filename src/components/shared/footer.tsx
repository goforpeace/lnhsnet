import { Mountain } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-7xl py-12">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <h3 className="font-headline text-lg font-bold">Landmark Estates</h3>
              <p className="text-sm text-muted-foreground">
                Where every square feet tells a story
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Landmark Estates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
