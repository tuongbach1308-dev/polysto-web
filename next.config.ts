import type { NextConfig } from "next";
import { bloggerRedirects } from "./src/lib/blogger-redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return bloggerRedirects;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vtaudcllsgtksjiaiiqt.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
