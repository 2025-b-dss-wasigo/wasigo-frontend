import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.204.77.116', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: process.env.IMAGE_PROTOCOL === "https" ? "https" : "http",
        hostname: process.env.IMAGE_HOSTNAME || "127.0.0.1",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
