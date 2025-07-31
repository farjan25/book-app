import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.mjs$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;