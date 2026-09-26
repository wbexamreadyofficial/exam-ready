'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FolderKanban, Loader2, Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

import { blogCategoriesApi } from '@/lib/api/blogCategories';
import { getErrorMessage } from '@/lib/api/errors';
import { ELEVATED_CARD } from '@/lib/constants';
import { blogCategoryFormSchema, type BlogCategoryFormInput } from '@/schemas/blogCategory.schema';
import type { BlogCategory } from '@/types/blogCategory';

import { FilterBarLite, SearchBox, FilterSelect } from '@/components/admin/blogs/FilterBarLite';
import { RelationButton } from '@/components/admin/blogs/RelationButton';
import { BlogListPanel } from '@/components/admin/blogs/BlogListPanel';
import { ALL, useBlogListState } from '@/components/admin/blogs/useBlogListState';
import { ACTIVE_OPTIONS } from '@/components/admin/blogs/shared';
import { BlogsByCategoryDialog } from '@/components/admin/blogs/BlogsByCategoryDialog';
import { BlogEngagementDialog } from '@/components/admin/blogs/BlogEngagementDialog';

const emptyForm: BlogCategoryFormInput = { name: '', description: '', isActive: true, displayOrder: 0 };

const toFormValues = (category: BlogCategory): BlogCategoryFormInput => ({
  name: category.name,
  description: category.description ?? '',
  isActive: category.isActive,
  displayOrder: category.displayOrder,
});

export default function BlogCategoriesAdminPage() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<BlogCategory | null>(null);
  const [engagementBlogId, setEngagementBlogId] = useState<string | null>(null);

  const state = useBlogListState({ isActive: ALL });

  const params = {
    search: state.debouncedSearch || undefined,
    isActive: state.filters.isActive === ALL ? undefined : state.filters.isActive === 'true',
    page: state.page,
    limit: state.pageSize,
  };

  const query = useQuery({
    queryKey: ['blog-categories', params],
    queryFn: async () => {
      const result = await blogCategoriesApi.getCategories(params);
      return { items: result.categories, pagination: result.pagination };
    },
    placeholderData: (previous) => previous,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BlogCategoryFormInput>({
    resolver: zodResolver(blogCategoryFormSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    reset(editingCategory ? toFormValues(editingCategory) : emptyForm);
  }, [editingCategory, dialogOpen, reset]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['blog-categories'] });

  const createMutation = useMutation({
    mutationFn: blogCategoriesApi.createCategory,
    onSuccess: () => {
      refresh();
      toast.success('Blog category created');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not create category')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: BlogCategoryFormInput }) =>
      blogCategoriesApi.updateCategory(categoryId, payload),
    onSuccess: () => {
      refresh();
      toast.success('Blog category updated');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update category')),
  });

  const deleteMutation = useMutation({
    mutationFn: blogCategoriesApi.deleteCategory,
    onSuccess: () => {
      refresh();
      toast.success('Blog category deleted');
      setDeleteTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete category')),
  });

  const onSubmit = (values: BlogCategoryFormInput) => {
    const payload = { ...values, description: values.description?.trim() || undefined };
    if (editingCategory) updateMutation.mutate({ categoryId: editingCategory._id, payload });
    else createMutation.mutate(payload);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Categories"
        description="Group blogs by topic — e.g. “Exam Updates”, “Study Tips”. Open a category to see the blogs filed under it."
        actions={
          <Button
            variant="cta"
            className="gap-2 font-bold"
            onClick={() => {
              setEditingCategory(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBarLite hasFilters={state.hasFilters} onClear={state.clear}>
            <SearchBox value={state.search} onChange={state.setSearch} placeholder="Search by name or description…" />
            <FilterSelect
              label="Status"
              value={state.filters.isActive}
              onChange={(value) => state.setFilters({ isActive: value })}
              options={ACTIVE_OPTIONS}
              allLabel="Active and inactive"
              className="sm:w-48"
            />
          </FilterBarLite>
        </CardContent>
      </Card>

      <BlogListPanel
        query={query}
        columns={['Category', 'Blogs', 'Status', 'Actions']}
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
        hasFilters={state.hasFilters}
        empty={{ icon: FolderKanban, title: 'No blog categories yet', description: 'Add your first blog category to get started.' }}
      >
        {(categories) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Blogs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      <div>
                        <p className="text-sm font-semibold">{category.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{category.description || category.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RelationButton
                      icon={Newspaper}
                      label="Blogs"
                      count={category.blogCount ?? 0}
                      onClick={() => setViewingCategory(category)}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        category.isActive
                          ? 'inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'inline-flex items-center rounded-full border border-transparent bg-[var(--color-secondary)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-secondary-foreground)]'
                      }
                    >
                      {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => {
                        setEditingCategory(category);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-500"
                      disabled={(category.blogCount ?? 0) > 0}
                      title={
                        (category.blogCount ?? 0) > 0
                          ? 'This category still has blogs under it. Move or delete them first, or deactivate the category instead.'
                          : 'Delete category'
                      }
                      onClick={() => setDeleteTarget(category)}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </BlogListPanel>

      <BlogsByCategoryDialog
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
        onOpenEngagement={setEngagementBlogId}
      />
      <BlogEngagementDialog blogId={engagementBlogId} onClose={() => setEngagementBlogId(null)} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Blog Category' : 'Add Blog Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the details for this blog category.' : 'Create a new category to file blogs under.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" placeholder="e.g. Exam Updates" error={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Short description of this category" error={!!errors.description} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" min={0} error={!!errors.displayOrder} {...register('displayOrder', { valueAsNumber: true })} />
              {errors.displayOrder && <p className="text-xs text-red-500">{errors.displayOrder.message}</p>}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="cta" disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Blog Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              className="gap-2"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
