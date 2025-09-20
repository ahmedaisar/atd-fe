/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // Reduce build memory usage in production
  productionBrowserSourceMaps: false,
  webpack: (config, { dev }) => {
    if (!dev) {
      // Disable persistent filesystem cache to prevent OOM on Windows
      config.cache = false
      // Use a stable hash function (avoid wasm-dependent hashing)
      config.output = {
        ...config.output,
        hashFunction: 'sha256',
      }
      // Limit parallelism to reduce peak memory
      config.optimization = {
        ...config.optimization,
        minimizer: config.optimization?.minimizer,
      }
    }
    return config
  },
}

export default nextConfig
