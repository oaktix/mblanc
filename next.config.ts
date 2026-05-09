import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
};

export default nextConfig;
