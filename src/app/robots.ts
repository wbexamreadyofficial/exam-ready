import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/exam/', '/profile/', '/results/'],
    },
    sitemap: 'https://examready.in/sitemap.xml',
  };
}
