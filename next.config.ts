import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // A package-lock.json in the parent folder would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
