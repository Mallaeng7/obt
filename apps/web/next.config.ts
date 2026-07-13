import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  // monorepo에서 standalone 빌드 시 node_modules를 올바르게 추적하기 위해
  // 루트(모노레포 최상위)를 기준으로 파일을 탐색
  outputFileTracingRoot: path.join(__dirname, '../../'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
