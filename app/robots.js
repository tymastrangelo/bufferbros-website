export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://bufferbros.org/sitemap.xml',
  };
}
