import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Only nudge coding agents about security upgrades (not every new release)
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [new URL("https://ecommerce.routemisr.com/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
