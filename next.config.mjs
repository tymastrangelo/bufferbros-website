/** @type {import('next').NextConfig} */
const nextConfig = {
  // verify builds go to BUILD_DIR so they never clobber a running `next dev` in .next
  distDir: process.env.BUILD_DIR || '.next',
  // Old static-site URLs (ads, bookmarks, QR codes) keep working.
  async redirects() {
    const pages = ['about', 'packages', 'portfolio', 'booking', 'connect', 'terms', 'privacy', 'thank-you'];
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/quote.html', destination: '/booking', permanent: true },
      { source: '/quote', destination: '/booking', permanent: true },
      ...pages.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
    ];
  },
};

export default nextConfig;
