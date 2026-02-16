/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * React Compiler (experimental/beta)
   * - Enabled both at the top level (Next.js 15+)
   * - And under `experimental` to match requested shape
   */
  reactCompiler: true,
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;

