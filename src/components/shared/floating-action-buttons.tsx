"use client";

import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function FloatingActionButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
      <Button asChild size="icon" className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg">
        <a href="tel:+8809649699499" aria-label="Call Us">
          <Phone className="h-7 w-7" />
        </a>
      </Button>
      <Button asChild size="icon" className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg">
        <a href="https://m.me/landmarkltd.net" target="_blank" rel="noopener noreferrer" aria-label="Chat on Messenger">
          <MessageSquare className="h-7 w-7" />
        </a>
      </Button>
    </div>
  );
}
