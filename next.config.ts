import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // next/image optimization needs a server; with static export we
    // optimize images ourselves at commit time instead.
    unoptimized: true,
  },
};

export default nextConfig;
