import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos de véhicules : fichiers dans /public ou URL https (renseignées depuis l'admin)
  images: { formats: ["image/avif", "image/webp"], remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};

export default nextConfig;
