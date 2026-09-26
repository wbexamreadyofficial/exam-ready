'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorState } from '@/components/ui/error-state';
import { BlogForm } from '@/components/admin/blogs/BlogForm';
import { blogsApi } from '@/lib/api/blogs';

export default function EditBlogAdminPage() {
  const params = useParams<{ blogId: string }>();
  const blogId = params.blogId;

  const query = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogsApi.getBlog(blogId),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Blog" description={query.data?.title ?? 'Loading…'} />

      {query.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-muted-foreground)]" />
        </div>
      ) : query.isError || !query.data ? (
        <ErrorState message="Could not load this blog." onRetry={() => query.refetch()} />
      ) : (
        <BlogForm blog={query.data} />
      )}
    </div>
  );
}
