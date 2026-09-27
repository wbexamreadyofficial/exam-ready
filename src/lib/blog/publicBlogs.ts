import { env } from '@/config/env';
import type { ApiResponse } from '@/types/api';
import type { Blog } from '@/types/blog';

interface BlogsResponse extends ApiResponse<{ blogs: Blog[] }> {
  pagination?: { totalPages: number };
}

/** All published, active blogs, newest first — the public blog list and detail
 *  pages both work off this one fetch instead of a per-post lookup, since the
 *  backend's single-blog endpoint is keyed by id, not slug. */
export async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const blogs: Blog[] = [];
    let totalPages = 1;
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `${env.apiUrl}/blogs?status=PUBLISHED&isActive=true&limit=50&page=${page}&sortBy=publishedAt&sortOrder=desc`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(10_000) }
      );
      if (!response.ok) throw new Error('Blog list unavailable');
      const payload = (await response.json()) as BlogsResponse;
      if (!payload.success || !Array.isArray(payload.data?.blogs)) throw new Error('Invalid blog response');
      blogs.push(...payload.data.blogs);
      totalPages = payload.pagination?.totalPages ?? 1;
    }
    return blogs;
  } catch {
    return [];
  }
}

export function getBlogCategoryLabel(category: Blog['category']): string {
  if (typeof category === 'string') return category;
  return category?.name ?? 'General';
}

export function formatBlogDate(post: Pick<Blog, 'publishedAt' | 'createdAt'>): string {
  const iso = post.publishedAt ?? post.createdAt;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getBlogExcerpt(post: Pick<Blog, 'excerpt' | 'content'>, maxLength = 160): string {
  if (post.excerpt) return post.excerpt;
  const text = post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

export function formatReadingTime(minutes: number): string {
  const rounded = Math.max(1, Math.round(minutes || 1));
  return `${rounded} min read`;
}
