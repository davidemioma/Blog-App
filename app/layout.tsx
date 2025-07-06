import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/query-providers";

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
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <Toaster richColors />

            <Navbar />

            {children}

            <Footer />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
