export default function sitemap() {
  const base = 'https://bufferbros.org';
  const page = (path, priority, changeFrequency = 'monthly') => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });
  return [
    page('', 1, 'weekly'),
    page('/booking', 0.9, 'weekly'),
    page('/packages', 0.9, 'weekly'),
    page('/about', 0.7),
    page('/portfolio', 0.6),
    page('/terms', 0.2, 'yearly'),
    page('/privacy', 0.2, 'yearly'),
  ];
}
