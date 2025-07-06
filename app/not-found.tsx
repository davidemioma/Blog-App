import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 text */}
            <div className="text-8xl font-bold text-muted-foreground/20 select-none">
              404
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-primary/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-6 w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-12 left-4 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might
            have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Posts
            </Link>
          </div>

          {/* Back button */}
          <div className="pt-4">
            <Link
              href="javascript:history.back()"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </Link>
          </div>
        </div>

        {/* Helpful tip */}
        <div className="mt-12 p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Use the search bar in the navigation to find
            what you&apos;re looking for, or check out our latest blog posts.
          </p>
        </div>
      </div>
    </div>
  );
}
