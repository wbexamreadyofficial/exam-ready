import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/', '/examiner/', '/partner/'],
    },
    sitemap: 'https://examready.in/sitemap.xml',
  };
}
