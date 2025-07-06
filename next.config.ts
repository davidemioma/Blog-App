import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "db1ab63zorkhe.cloudfront.net",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
