/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Work around a Webpack Wasm hashing crash in some Node 22/Next 15 builds
  // by forcing a non-WASM hash function.
  webpack: (config) => {
    config.output = {
      ...config.output,
      hashFunction: 'sha256',
    }
    return config
  },
}

export default nextConfig
