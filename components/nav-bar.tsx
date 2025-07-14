"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./search-bar";
import { usePathname } from "next/navigation";
import PostModal from "./modals/post.modal";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-24 h-6 rounded" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Skeleton className="w-20 h-8 rounded" />
            <Skeleton className="w-20 h-8 rounded" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="hidden md:flex shrink-0 items-center gap-2">
          <Image src="/next.svg" alt="Blog App Logo" width={32} height={32} />

          <span className="font-bold text-xl tracking-tight text-primary">
            Blog App
          </span>
        </Link>

        {pathname === "/" && <SearchBar />}

        <div className="flex items-center gap-2 sm:gap-4">
          {isSignedIn ? (
            <>
              {!pathname.includes("/posts") && (
                <PostModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  onOpenChange={setOpen}
                  icon={<PlusIcon className="w-4 h-4" />}
                />
              )}

              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>

              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
