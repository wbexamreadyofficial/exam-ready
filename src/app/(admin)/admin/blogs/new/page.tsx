'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { BlogForm } from '@/components/admin/blogs/BlogForm';

export default function NewBlogAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Blog" description="Write a new blog post — pick an author and category to get started." />
      <BlogForm />
    </div>
  );
}
