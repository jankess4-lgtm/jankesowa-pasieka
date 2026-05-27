/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://jankesowapasieka.pl',
    NEXT_PUBLIC_API_URL: 'https://jankesowapasieka.pl/api',
  },

  async redirects() {
    return [
      // 1. www → domena główna (.pl)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.jankesowapasieka.pl' }],
        destination: 'https://jankesowapasieka.pl/:path*',
        permanent: true,
      },
      // 2. jankesowapasieka.com.pl → jankesowapasieka.pl
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jankesowapasieka.com.pl' }],
        destination: 'https://jankesowapasieka.pl/:path*',
        permanent: true,
      },
      // 3. www.jankesowapasieka.com.pl → jankesowapasieka.pl
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.jankesowapasieka.com.pl' }],
        destination: 'https://jankesowapasieka.pl/:path*',
        permanent: true,
      },
    ];
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'jankesowapasieka.pl' },
    ],
  },
};

module.exports = nextConfig;