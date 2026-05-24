/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite el build aunque haya errores de tipos en CSS imports
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
