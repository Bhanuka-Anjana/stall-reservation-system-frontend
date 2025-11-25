import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/:path*',
      },
    ];
  },
};

export default nextConfig;
