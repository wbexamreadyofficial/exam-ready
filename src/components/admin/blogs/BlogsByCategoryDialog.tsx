'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Eye, Heart, MessageSquare, Newspaper, Pencil } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilterBarLite, FilterSelect, SearchBox } from './FilterBarLite';
import { RelationButton } from './RelationButton';
import { ALL, useBlogListState } from './useBlogListState';
import { BlogListPanel } from './BlogListPanel';
import { BLOG_STATUS_OPTIONS, BlogStatusBadge, plural } from './shared';
import { blogsApi } from '@/lib/api/blogs';
import type { BlogCategory } from '@/types/blogCategory';

interface BlogsByCategoryDialogProps {
  category: BlogCategory | null;
  onClose: () => void;
  onOpenEngagement: (blogId: string) => void;
}

/** "View blogs" for one blog category — opened from the categories list. */
export function BlogsByCategoryDialog({ category, onClose, onOpenEngagement }: BlogsByCategoryDialogProps) {
  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        {category && <DialogBody category={category} onOpenEngagement={onOpenEngagement} />}
      </DialogContent>
    </Dialog>
  );
}

function DialogBody({ category, onOpenEngagement }: { category: BlogCategory; onOpenEngagement: (blogId: string) => void }) {
  const state = useBlogListState({ status: ALL });

  const params = {
    category: category._id,
    search: state.debouncedSearch || undefined,
    status: state.filters.status === ALL ? undefined : (state.filters.status as never),
    page: state.page,
    limit: state.pageSize,
  };

  const query = useQuery({
    queryKey: ['blogs', 'by-category', category._id, params],
    queryFn: async () => {
      const result = await blogsApi.getBlogs(params);
      return { items: result.blogs, pagination: result.pagination };
    },
    placeholderData: (previous) => previous,
  });

  return (
    <>
      <DialogHeader className="space-y-1.5 border-b border-[var(--color-border)] px-6 pb-4 pt-6 pr-12">
        <DialogTitle className="text-lg leading-tight">{category.name}</DialogTitle>
        <DialogDescription>
          {plural(category.blogCount ?? query.data?.pagination.total ?? 0, 'blog')} filed under this category.
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
        <FilterBarLite hasFilters={state.hasFilters} onClear={state.clear} className="mb-4">
          <SearchBox value={state.search} onChange={state.setSearch} placeholder="Search blogs in this category…" />
          <FilterSelect
            label="Status"
            value={state.filters.status}
            onChange={(value) => state.setFilters({ status: value })}
            options={BLOG_STATUS_OPTIONS}
            allLabel="Any status"
            className="sm:w-44"
          />
        </FilterBarLite>

        <BlogListPanel
          bare
          query={query}
          columns={['Blog', 'Status', 'Engagement', 'Actions']}
          pageSize={state.pageSize}
          onPageChange={state.setPage}
          onPageSizeChange={state.setPageSize}
          hasFilters={state.hasFilters}
          empty={{ icon: Newspaper, title: 'No blogs here yet', description: 'Blogs filed under this category will show up here.' }}
        >
          {(blogs) => (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <p className="text-sm font-semibold">{blog.title}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">by {blog.authorLabel}</p>
                    </TableCell>
                    <TableCell>
                      <BlogStatusBadge status={blog.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {blog.viewCount}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {blog.likeCount}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {blog.commentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      <RelationButton
                        icon={MessageSquare}
                        label="Comments & Likes"
                        count={blog.commentCount + blog.likeCount}
                        onClick={() => onOpenEngagement(blog._id)}
                      />
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5" asChild>
                        <Link href={`/admin/blogs/${blog._id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </BlogListPanel>
      </div>
    </>
  );
}
