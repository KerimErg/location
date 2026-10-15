import type { NextConfig } from "next";

// Export statique : le dossier `out/` peut être hébergé n'importe où (Netlify, Cloudflare Pages, Vercel...).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: __dirname,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
