import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // ✅ REQUIRED
  images: {
    unoptimized: true,
  },
};

export default nextConfig;