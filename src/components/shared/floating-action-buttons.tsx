
"use client";

import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function FloatingActionButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
      <Button asChild size="icon" className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        <a href="tel:+8809649699499" aria-label="Call Us">
          <Phone className="h-6 w-6" />
        </a>
      </Button>
      <Button asChild size="icon" className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        <a href="https://m.me/landmarkltd.net" target="_blank" rel="noopener noreferrer" aria-label="Chat on Messenger">
          <MessageSquare className="h-6 w-6" />
        </a>
      </Button>
    </div>
  );
}
