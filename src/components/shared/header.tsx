
"use client";

import Link from 'next/link';
import { Building, Menu, Mountain } from 'lucide-react';
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
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
                src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                alt="Landmark New Homes Ltd. Logo"
                width={150}
                height={35}
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
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
                <Link href="/cmi">Admin Dashboard</Link>
            </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden ml-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <Image 
                    src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png" 
                    alt="Landmark New Homes Ltd. Logo"
                    width={150}
                    height={35}
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
