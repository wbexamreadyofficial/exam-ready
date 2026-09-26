'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { UserAutocomplete } from '@/components/admin/UserAutocomplete';
import { CategoryCombobox, type SelectableCategory } from './CategoryCombobox';
import { CoverImageUpload } from './CoverImageUpload';
import { BlogContentEditor } from './BlogContentEditor';
import { BLOG_STATUS_OPTIONS } from './shared';

import { blogsApi } from '@/lib/api/blogs';
import { getErrorMessage } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import { blogFormSchema } from '@/schemas/blog.schema';
import type { Blog, BlogCoverImage, BlogStatus, CreateBlogInput, UpdateBlogInput } from '@/types/blog';
import type { UserSuggestion } from '@/types/user';

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** ISO string → the value a `datetime-local` input wants, in the browser's own timezone. */
const toLocalInputValue = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

interface BlogFormProps {
  /** Present when editing an existing blog. */
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentAdmin = useAuthStore((state) => state.user);

  const initialCategory: SelectableCategory | null =
    blog && typeof blog.category !== 'string' ? { _id: blog.category._id, name: blog.category.name } : null;
  const initialAuthor: UserSuggestion | null =
    blog && blog.author && typeof blog.author !== 'string'
      ? { _id: blog.author._id, fullName: blog.author.fullName, email: blog.author.email, profilePhoto: blog.author.profilePhoto }
      : null;

  const [title, setTitle] = useState(blog?.title ?? '');
  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!blog);
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? '');
  const [content, setContent] = useState(blog?.content ?? '');
  const [coverImage, setCoverImage] = useState<BlogCoverImage | null>(blog?.coverImage ?? null);
  const [category, setCategory] = useState<SelectableCategory | null>(initialCategory);
  const [tags, setTags] = useState<string[]>(blog?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<UserSuggestion | null>(initialAuthor);
  const [authorLabel, setAuthorLabel] = useState(blog?.authorLabel ?? currentAdmin?.fullName ?? '');
  const [status, setStatus] = useState<BlogStatus>(blog?.status ?? 'DRAFT');
  const [scheduledAt, setScheduledAt] = useState(toLocalInputValue(blog?.scheduledAt));
  const [isFeatured, setIsFeatured] = useState(blog?.isFeatured ?? false);
  const [displayOrder, setDisplayOrder] = useState(blog?.displayOrder ?? 0);
  const [metaTitle, setMetaTitle] = useState(blog?.seo?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(blog?.seo?.metaDescription ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!blog;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 15) setTags((current) => [...current, tag]);
    setTagInput('');
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateBlogInput) => blogsApi.createBlog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast.success('Blog created');
      router.push('/admin/blogs');
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not create the blog')),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateBlogInput) => blogsApi.updateBlog(blog!._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blog!._id] });
      toast.success('Blog updated');
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update the blog')),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = blogFormSchema.safeParse({
      title,
      slug,
      excerpt,
      content,
      category: category?._id ?? '',
      tags,
      author: selectedAuthor?._id ?? '',
      authorLabel,
      status,
      scheduledAt,
      isFeatured,
      displayOrder,
      metaTitle,
      metaDescription,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }
    setErrors({});

    const payload = {
      title: result.data.title,
      slug: result.data.slug || undefined,
      excerpt: result.data.excerpt || undefined,
      content: result.data.content,
      coverImage: coverImage ?? undefined,
      category: result.data.category,
      tags: result.data.tags,
      author: result.data.author || undefined,
      authorLabel: result.data.authorLabel,
      status: result.data.status,
      scheduledAt:
        result.data.status === 'SCHEDULED' && result.data.scheduledAt
          ? new Date(result.data.scheduledAt).toISOString()
          : undefined,
      seo: { metaTitle: result.data.metaTitle || undefined, metaDescription: result.data.metaDescription || undefined },
      isFeatured: result.data.isFeatured,
      displayOrder: result.data.displayOrder,
    };

    if (isEditing) updateMutation.mutate(payload);
    else createMutation.mutate(payload as CreateBlogInput);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>
                Author <span className="text-red-500">*</span>
              </Label>
              <UserAutocomplete
                inputValue={authorInput}
                onInputChange={setAuthorInput}
                selected={selectedAuthor}
                onSelect={(user) => {
                  setSelectedAuthor(user);
                  if (user) setAuthorLabel(user.fullName || user.email || user.mobileNumber || authorLabel);
                }}
              />
              <Input
                aria-label="Author name"
                placeholder="Author name shown on the blog"
                value={authorLabel}
                error={!!errors.authorLabel}
                onChange={(event) => setAuthorLabel(event.target.value)}
              />
              {errors.authorLabel && <p className="text-xs text-red-500">{errors.authorLabel}</p>}
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Search to link a real account, or just type a byline — linking is optional.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>
                Category <span className="text-red-500">*</span>
              </Label>
              <CategoryCombobox value={category} onChange={setCategory} />
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Pick an existing category, or type a new name to create it.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. WBPSC Clerkship 2026 Notification — What You Need to Know"
                value={title}
                error={!!errors.title}
                onChange={(event) => handleTitleChange(event.target.value)}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                placeholder="auto-generated-from-title"
                value={slug}
                error={!!errors.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
              />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
              <p className="text-xs text-[var(--color-muted-foreground)]">/blog/{slug || 'your-slug-here'}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="A short summary shown on the blog card and in search results"
                value={excerpt}
                error={!!errors.excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
              {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cover image</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <CoverImageUpload value={coverImage} onChange={setCoverImage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Content <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <BlogContentEditor content={content} onChange={setContent} />
            {errors.content && <p className="mt-1.5 text-xs text-red-500">{errors.content}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-5 pt-0">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1.5">
                  {tag}
                  <button type="button" onClick={() => setTags((current) => current.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagInput);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Publish settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as BlogStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status === 'SCHEDULED' && (
              <div className="space-y-1.5">
                <Label htmlFor="scheduledAt">Publish at</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  error={!!errors.scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                />
                {errors.scheduledAt && <p className="text-xs text-red-500">{errors.scheduledAt}</p>}
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured
              </Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display order</Label>
              <Input
                id="displayOrder"
                type="number"
                min={0}
                value={displayOrder}
                onChange={(event) => setDisplayOrder(Number(event.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="space-y-1.5">
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input id="metaTitle" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} maxLength={70} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                maxLength={160}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/admin/blogs')}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" className="flex-1 gap-2 font-bold" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? 'Save Changes' : 'Create Blog'}
          </Button>
        </div>
      </div>
    </form>
  );
}
