
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Start fade out after a short delay
          setTimeout(() => {
            setIsFadingOut(true);
          }, 100);

          // Announce completion after fade out duration
          setTimeout(() => {
            onFinished();
          }, 600); // 500ms for fade out + buffer

          return 100;
        }
        return prev + 1;
      });
    }, 25); // 100 steps * 25ms = 2.5 seconds

    return () => clearInterval(progressInterval);
  }, [onFinished]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out",
        isFadingOut ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center text-center w-full max-w-sm px-4">
        <Image
          src="https://res.cloudinary.com/dj4lirc0d/image/upload/f_auto,q_auto/Artboard_1_pabijh.png"
          alt="Landmark New Homes Ltd. Logo"
          width={250}
          height={56}
          priority
          className="object-contain h-auto w-auto mb-6"
        />
        <p className="text-lg text-muted-foreground">Welcome To</p>
        <h1 className="text-2xl font-semibold text-primary mt-1">
          Landmark New Homes Ltd.
        </h1>
        <Progress value={progress} className="w-full mt-8" />
      </div>
    </div>
  );
}
