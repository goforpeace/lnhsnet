
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#services', label: 'Services' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image 
                src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                alt="Landmark New Homes Ltd. Logo"
                width={180}
                height={40}
                priority
                className="object-contain"
            />
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
            <Button asChild className="hidden sm:inline-flex">
                <Link href="/cmi">Admin Dashboard</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center mb-6">
                    <Image 
                        src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                        alt="Landmark New Homes Ltd. Logo"
                        width={180}
                        height={40}
                        className="object-contain"
                    />
                </Link>
                <nav className="flex flex-col gap-4 text-lg">
                    {navLinks.map(({ href, label }) => (
                    <Link
                        key={label}
                        href={href}
                        className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === href ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        {label}
                    </Link>
                    ))}
                </nav>
                <Button asChild className="mt-6 w-full">
                    <Link href="/cmi">Admin Dashboard</Link>
                </Button>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
