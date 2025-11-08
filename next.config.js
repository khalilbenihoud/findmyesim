/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.airalo.com',
      },
      {
        protocol: 'https',
        hostname: 'esim.holafly.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nomad-esim.com',
      },
      {
        protocol: 'https',
        hostname: 'www.orange.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ubigi.com',
      },
    ],
  },
}

module.exports = nextConfig

