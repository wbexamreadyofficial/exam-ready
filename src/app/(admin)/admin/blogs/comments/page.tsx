'use client';

import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';

import { blogCommentsApi } from '@/lib/api/blogComments';
import { ELEVATED_CARD } from '@/lib/constants';
import type { BlogCommentStatus } from '@/types/blogComment';

import { FilterBarLite, FilterSelect, SearchBox } from '@/components/admin/blogs/FilterBarLite';
import { BlogListPanel } from '@/components/admin/blogs/BlogListPanel';
import { ALL, useBlogListState } from '@/components/admin/blogs/useBlogListState';
import { CommentRow } from '@/components/admin/blogs/BlogEngagementDialog';

const COMMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'SPAM', label: 'Spam' },
];

export default function BlogCommentsAdminPage() {
  const state = useBlogListState({ status: ALL });

  const params = {
    search: state.debouncedSearch || undefined,
    status: state.filters.status === ALL ? undefined : (state.filters.status as BlogCommentStatus),
    page: state.page,
    limit: state.pageSize,
  };

  const query = useQuery({
    queryKey: ['blog-comments', params],
    queryFn: async () => {
      const result = await blogCommentsApi.getComments(params);
      return { items: result.comments, pagination: result.pagination };
    },
    placeholderData: (previous) => previous,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Comments"
        description="Moderation queue for every comment across all blogs — approve, reject, or mark as spam."
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBarLite hasFilters={state.hasFilters} onClear={state.clear}>
            <SearchBox value={state.search} onChange={state.setSearch} placeholder="Search by comment text or commenter name…" />
            <FilterSelect
              label="Status"
              value={state.filters.status}
              onChange={(value) => state.setFilters({ status: value })}
              options={COMMENT_STATUS_OPTIONS}
              allLabel="Any status"
              className="sm:w-48"
            />
          </FilterBarLite>
        </CardContent>
      </Card>

      <BlogListPanel
        query={query}
        columns={['Comment']}
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
        hasFilters={state.hasFilters}
        empty={{ icon: MessageSquare, title: 'No comments yet', description: 'Comments posted on any blog will show up here for moderation.' }}
      >
        {(comments) => (
          <div className="space-y-2 p-4">
            {comments.map((comment) => (
              <CommentRow key={comment._id} comment={comment} showBlogLink />
            ))}
          </div>
        )}
      </BlogListPanel>
    </div>
  );
}
