'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

import { categoriesApi } from '@/lib/api/categories';
import { getErrorMessage } from '@/lib/api/errors';
import { useDebounce } from '@/hooks/useDebounce';
import { ELEVATED_CARD } from '@/lib/constants';
import { categoryFormSchema, type CategoryFormInput } from '@/schemas/category.schema';
import type { Category, CategorySortField, SortOrder } from '@/types/category';
import { PageHeader } from '@/components/layout/PageHeader';

type StatusFilter = 'all' | 'active' | 'inactive';
/** The table only exposes sorting by these two columns. */
type SortColumn = Extract<CategorySortField, 'name' | 'isActive'>;

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const emptyForm: CategoryFormInput = {
  name: '',
  fullForm: '',
  description: '',
  isActive: true,
  displayOrder: 0,
};

function SortIcon({
  column,
  activeColumn,
  order,
}: {
  column: SortColumn;
  activeColumn: SortColumn;
  order: SortOrder;
}) {
  if (activeColumn !== column) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
  return order === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

function CategoryTableSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-busy="true" aria-label="Loading categories">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Full Form</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-56 max-w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-[var(--color-border)]">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}

function toFormValues(category: Category): CategoryFormInput {
  return {
    name: category.name,
    fullForm: category.fullForm ?? '',
    description: category.description ?? '',
    isActive: category.isActive,
    displayOrder: category.displayOrder,
  };
}

export default function CategoriesAdminPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const listParams = {
    search: debouncedSearch.trim() || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy: sortColumn,
    sortOrder,
    page,
    limit: pageSize,
  };

  const {
    data: result,
    isLoading,
    isError,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ['admin-categories', listParams],
    queryFn: () => categoriesApi.getCategories(listParams),
    placeholderData: (previous) => previous,
  });

  const categories = result?.categories ?? [];
  const pagination = result?.pagination;
  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);
  /** True once any list-affecting filter has been applied at least once, so
   *  the very first successful load can still tell "no categories exist" apart
   *  from "no categories match the current search/filter". */
  const hasActiveListParams = Boolean(debouncedSearch.trim()) || statusFilter !== 'all';

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    reset(editingCategory ? toFormValues(editingCategory) : emptyForm);
  }, [editingCategory, dialogOpen, reset]);

  const createMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category created successfully');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not create category')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: CategoryFormInput }) =>
      categoriesApi.updateCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category updated successfully');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update category')),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted successfully');
      setDeleteTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete category')),
  });

  const openCreateDialog = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const onSubmit = (values: CategoryFormInput) => {
    const payload = {
      ...values,
      fullForm: values.fullForm?.trim() || undefined,
      description: values.description?.trim() || undefined,
    };

    if (editingCategory) {
      updateMutation.mutate({ categoryId: editingCategory._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  const toggleSort = (column: SortColumn) => {
    setPage(1);
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Categories"
        description="Manage the exam categories (WBP SI, Food SI, etc.) shown across the platform"
        actions={
          <Button variant="cta" className="font-bold gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
        }
      />

      {(totalItems > 0 || hasActiveListParams) && (
        <Card className={ELEVATED_CARD}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                <Input
                  placeholder="Search by name, slug, or full form..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as StatusFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-44">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(search.trim() || statusFilter !== 'all') && (
                <Button variant="ghost" className="gap-1.5" onClick={clearFilters}>
                  <X className="h-4 w-4" /> Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-0">
          {isLoading || isPlaceholderData ? (
            <CategoryTableSkeleton rows={Math.min(pageSize, 10)} />
          ) : isError ? (
            <ErrorState message="Could not load categories." onRetry={() => refetch()} className="py-16" />
          ) : totalItems === 0 ? (
            hasActiveListParams ? (
              <EmptyState
                icon={Search}
                title="No matching categories"
                description="Try adjusting your search or filter"
                className="py-16"
              />
            ) : (
              <EmptyState
                icon={FolderKanban}
                title="No categories yet"
                description="Create your first exam category to get started"
                action={{ label: 'Add Category', onClick: openCreateDialog, variant: 'cta' }}
                className="py-16"
              />
            )
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => toggleSort('name')}
                        className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]"
                      >
                        Category <SortIcon column="name" activeColumn={sortColumn} order={sortOrder} />
                      </button>
                    </TableHead>
                    <TableHead>Full Form</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => toggleSort('isActive')}
                        className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]"
                      >
                        Status <SortIcon column="isActive" activeColumn={sortColumn} order={sortOrder} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-[var(--color-primary)]" />
                          <div>
                            <p className="font-semibold text-sm">{category.name}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">
                              {category.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--color-muted-foreground)]">
                        {category.fullForm || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? 'success' : 'secondary'}
                          className="text-[10px]"
                        >
                          {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => setDeleteTarget(category)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                  <span>Rows per page</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>
                    {totalItems === 0 ? '0 of 0' : `${rangeStart}-${rangeEnd} of ${totalItems}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(1)}
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-sm text-[var(--color-muted-foreground)] px-2 min-w-[3.5rem] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(totalPages)}
                    aria-label="Last page"
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the details for this exam category.'
                : 'Create a new exam category for candidates to browse.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" placeholder="e.g. Food SI" error={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fullForm">Full Form</Label>
              <Input
                id="fullForm"
                placeholder="e.g. West Bengal Food Sub-Inspector Exam"
                error={!!errors.fullForm}
                {...register('fullForm')}
              />
              {errors.fullForm && <p className="text-xs text-red-500">{errors.fullForm.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Short description of this exam category"
                error={!!errors.description}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                min={0}
                error={!!errors.displayOrder}
                {...register('displayOrder', { valueAsNumber: true })}
              />
              {errors.displayOrder && <p className="text-xs text-red-500">{errors.displayOrder.message}</p>}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                )}
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
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone.
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
