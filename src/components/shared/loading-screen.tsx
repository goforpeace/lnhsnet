
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar over 2.5 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // Update every 25ms to reach 100 in 2.5s

    // Wait for 2.5 seconds before starting the fade out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Announce completion after the fade-out animation finishes (500ms duration)
    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3000); // 2500ms wait + 500ms fade

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out",
        isFadingOut ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center text-center w-full max-w-sm px-4">
         <p className="text-lg text-muted-foreground mb-4">Welcome</p>
        <Image
          src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png"
          alt="Landmark New Homes Ltd. Logo"
          width={250}
          height={56}
          priority
          className="object-contain h-auto w-auto mb-8"
        />
        <Progress value={progress} className="w-full h-2" />
      </div>
    </div>
  );
}
