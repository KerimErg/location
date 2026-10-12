import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos libres de droits Unsplash (les autres URL distantes saisies dans l'admin sont servies sans optimisation).
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com", pathname: "/photos/**" },
    ],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};

export default nextConfig;
