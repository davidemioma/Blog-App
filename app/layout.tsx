import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/query-providers";

// Check if Clerk environment variables are available
const isClerkAvailable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog App",
  description: "Interesting blogs to read!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Toaster richColors />

          {isClerkAvailable && <Navbar />}

          {children}

          <Footer />
        </QueryProvider>
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if environment variables are available
  if (isClerkAvailable) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
