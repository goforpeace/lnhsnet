
"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "./loading-screen";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs only once on the client
  useEffect(() => {
    // Check if we've shown the loader before in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);
  
  const handleLoadingFinish = () => {
    sessionStorage.setItem("hasLoaded", "true");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen onFinished={handleLoadingFinish} />
      ) : (
        children
      )}
    </>
  );
}
