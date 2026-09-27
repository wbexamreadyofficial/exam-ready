'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Heart, Loader2, MessageSquare, Newspaper, Pencil, Plus, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

import { blogsApi } from '@/lib/api/blogs';
import { blogCategoriesApi } from '@/lib/api/blogCategories';
import { getErrorMessage } from '@/lib/api/errors';
import { ELEVATED_CARD } from '@/lib/constants';
import type { Blog } from '@/types/blog';

import { FilterBarLite, FilterSelect, SearchBox } from '@/components/admin/blogs/FilterBarLite';
import { RelationButton } from '@/components/admin/blogs/RelationButton';
import { BlogListPanel } from '@/components/admin/blogs/BlogListPanel';
import { ALL, useBlogListState } from '@/components/admin/blogs/useBlogListState';
import { BLOG_STATUS_OPTIONS, BlogStatusBadge } from '@/components/admin/blogs/shared';
import { BlogEngagementDialog } from '@/components/admin/blogs/BlogEngagementDialog';

function timeAgo(value?: string | null) {
  if (!value) return '—';
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
}

export default function BlogsAdminPage() {
  const queryClient = useQueryClient();
  const [engagementBlogId, setEngagementBlogId] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Blog | null>(null);

  const state = useBlogListState({ category: ALL, status: ALL });

  const categoriesQuery = useQuery({
    queryKey: ['blog-categories', 'options'],
    queryFn: () => blogCategoriesApi.getCategories({ limit: 100, sortBy: 'name', sortOrder: 'asc' }),
    staleTime: 60_000,
  });
  const categoryOptions = (categoriesQuery.data?.categories ?? []).map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const params = {
    search: state.debouncedSearch || undefined,
    category: state.filters.category === ALL ? undefined : state.filters.category,
    status: state.filters.status === ALL ? undefined : (state.filters.status as Blog['status']),
    page: state.page,
    limit: state.pageSize,
  };

  const query = useQuery({
    queryKey: ['blogs', params],
    queryFn: async () => {
      const result = await blogsApi.getBlogs(params);
      return { items: result.blogs, pagination: result.pagination };
    },
    placeholderData: (previous) => previous,
  });

  const archiveMutation = useMutation({
    mutationFn: blogsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Blog archived');
      setArchiveTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not archive the blog')),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Write and publish blog posts — articles, updates and guides for candidates."
        actions={
          <Button variant="cta" className="gap-2 font-bold" asChild>
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" /> Add Blog
            </Link>
          </Button>
        }
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBarLite hasFilters={state.hasFilters} onClear={state.clear}>
            <SearchBox value={state.search} onChange={state.setSearch} placeholder="Search by title, excerpt, author or tag…" />
            <FilterSelect
              label="Category"
              value={state.filters.category}
              onChange={(value) => state.setFilters({ category: value })}
              options={categoryOptions}
              allLabel="All categories"
              disabled={categoriesQuery.isLoading}
            />
            <FilterSelect
              label="Status"
              value={state.filters.status}
              onChange={(value) => state.setFilters({ status: value })}
              options={BLOG_STATUS_OPTIONS}
              allLabel="Any status"
              className="sm:w-44"
            />
          </FilterBarLite>
        </CardContent>
      </Card>

      <BlogListPanel
        query={query}
        columns={['Blog', 'Category', 'Status', 'Engagement', 'Published', 'Actions']}
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
        hasFilters={state.hasFilters}
        empty={{ icon: Newspaper, title: 'No blogs yet', description: 'Write your first blog to get started.' }}
      >
        {(blogs) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => {
                const category = typeof blog.category === 'string' ? null : blog.category;
                return (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        {blog.coverImage?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={blog.coverImage.url} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-[var(--color-muted)]">
                            <Newspaper className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                            {blog.isFeatured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                            {blog.title}
                          </p>
                          <p className="truncate text-xs text-[var(--color-muted-foreground)]">by {blog.authorLabel}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[var(--color-muted-foreground)]">{category?.name ?? '—'}</span>
                    </TableCell>
                    <TableCell>
                      <BlogStatusBadge status={blog.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="h-3.5 w-3.5" /> {blog.viewCount}
                        </span>
                        <span className="flex items-center gap-1" title="Likes">
                          <Heart className="h-3.5 w-3.5" /> {blog.likeCount}
                        </span>
                        <span className="flex items-center gap-1" title="Comments">
                          <MessageSquare className="h-3.5 w-3.5" /> {blog.commentCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[var(--color-muted-foreground)]">{timeAgo(blog.publishedAt)}</span>
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      <RelationButton
                        icon={MessageSquare}
                        label="Comments & Likes"
                        count={blog.commentCount + blog.likeCount}
                        onClick={() => setEngagementBlogId(blog._id)}
                      />
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5" asChild>
                        <Link href={`/admin/blogs/${blog._id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      {blog.isActive && (
                        <Button variant="ghost" size="sm" className="h-8 text-red-500" onClick={() => setArchiveTarget(blog)}>
                          Archive
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </BlogListPanel>

      <BlogEngagementDialog blogId={engagementBlogId} onClose={() => setEngagementBlogId(null)} />

      <Dialog open={!!archiveTarget} onOpenChange={(open) => !open && setArchiveTarget(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Archive Blog</DialogTitle>
            <DialogDescription>
              <strong>{archiveTarget?.title}</strong> will be hidden from readers, but its comments and likes stay intact. You can
              unarchive it later from the edit page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setArchiveTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={archiveMutation.isPending}
              className="gap-2"
              onClick={() => archiveTarget && archiveMutation.mutate(archiveTarget._id)}
            >
              {archiveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
