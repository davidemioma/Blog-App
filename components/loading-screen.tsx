import React from "react";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background animate-in fade-in-0">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/next.svg"
          alt="Blog App Logo"
          width={56}
          height={56}
          className="animate-spin-slow"
        />
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-primary/10 animate-ping"></span>

          <span className="relative inline-flex h-12 w-12 rounded-full bg-primary/30"></span>
        </div>

        <h2 className="text-2xl font-bold text-primary">Loading Blog App...</h2>

        <p className="text-muted-foreground text-sm">
          Please wait while we get things ready for you.
        </p>
      </div>
    </div>
  );
}
