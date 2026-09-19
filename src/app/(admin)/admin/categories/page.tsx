'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ChevronsUpDown, FileText, FolderKanban, HelpCircle, ListChecks, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

import { categoriesApi } from '@/lib/api/categories';
import { catalogApi, type CategoryRow } from '@/lib/api/catalog';
import { getErrorMessage } from '@/lib/api/errors';
import { ELEVATED_CARD } from '@/lib/constants';
import { categoryFormSchema, type CategoryFormInput } from '@/schemas/category.schema';
import type { SortOrder } from '@/types/category';
import { PageHeader } from '@/components/layout/PageHeader';
import { HierarchyGuide } from '@/components/admin/catalog/HierarchyGuide';
import { useRelationHost } from '@/components/admin/catalog/RelationDialog';
import { ACTIVE_OPTIONS, ActiveBadge, FilterBar, FilterSelect, ListPanel, RelationButton } from '@/components/admin/catalog/ui';
import { ALL, useListState } from '@/components/admin/catalog/useListState';

type SortColumn = 'name' | 'isActive';

const emptyForm: CategoryFormInput = { name: '', fullForm: '', description: '', isActive: true, displayOrder: 0 };

function SortIcon({ column, activeColumn, order }: { column: SortColumn; activeColumn: SortColumn; order: SortOrder }) {
  if (activeColumn !== column) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
  return order === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
}

const toFormValues = (category: CategoryRow): CategoryFormInput => ({
  name: category.name,
  fullForm: category.fullForm ?? '',
  description: category.description ?? '',
  isActive: category.isActive,
  displayOrder: category.displayOrder,
});

export default function CategoriesAdminPage() {
  const queryClient = useQueryClient();
  const relations = useRelationHost();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  const state = useListState({ isActive: ALL });
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const params = { ...state.params, sortBy: sortColumn, sortOrder };
  const query = useQuery({
    queryKey: ['catalog', 'categories', params],
    queryFn: () => catalogApi.categories(params),
    placeholderData: (previous) => previous,
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    reset(editingCategory ? toFormValues(editingCategory) : emptyForm);
  }, [editingCategory, dialogOpen, reset]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['catalog'] });

  const createMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      refresh();
      toast.success('Category created');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not create category')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: CategoryFormInput }) =>
      categoriesApi.updateCategory(categoryId, payload),
    onSuccess: () => {
      refresh();
      toast.success('Category updated');
      setDialogOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update category')),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      refresh();
      toast.success('Category deleted');
      setDeleteTarget(null);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete category')),
  });

  const onSubmit = (values: CategoryFormInput) => {
    const payload = { ...values, fullForm: values.fullForm?.trim() || undefined, description: values.description?.trim() || undefined };
    if (editingCategory) updateMutation.mutate({ categoryId: editingCategory._id, payload });
    else createMutation.mutate(payload);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const toggleSort = (column: SortColumn) => {
    state.setPage(1);
    if (sortColumn === column) setSortOrder((previous) => (previous === 'asc' ? 'desc' : 'asc'));
    else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const openCategory = (category: CategoryRow, view: 'exams' | 'question-sets' | 'questions') =>
    relations.open({ scope: 'categories', id: category._id, view });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Categories"
        description="The top level, like “WB Constable” or “Food SI”. Open a category to see the exams, question sets and questions inside it."
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

      <HierarchyGuide current="category" />

      <Card className={ELEVATED_CARD}>
        <CardContent className="p-4">
          <FilterBar state={state} searchPlaceholder="Search by name, full form or description…">
            <FilterSelect
              label="Status"
              value={state.filters.isActive}
              onChange={(value) => state.setFilters({ isActive: value })}
              options={ACTIVE_OPTIONS}
              allLabel="Active and inactive"
              className="sm:w-48"
            />
          </FilterBar>
        </CardContent>
      </Card>

      <ListPanel
        query={query}
        state={state}
        columns={['Category', 'What it contains', 'Status', 'Actions']}
        empty={{ icon: FolderKanban, title: 'No categories yet', description: 'Add your first exam category to get started.' }}
      >
        {(categories) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('name')} className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                    Category <SortIcon column="name" activeColumn={sortColumn} order={sortOrder} />
                  </button>
                </TableHead>
                <TableHead>What it contains</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort('isActive')} className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                    Status <SortIcon column="isActive" activeColumn={sortColumn} order={sortOrder} />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const total = category.counts.exams + category.counts.questionSets + category.counts.questions;
                return (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                        <div>
                          <p className="text-sm font-semibold">{category.name}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">{category.fullForm || category.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        <RelationButton icon={FileText} label="Exams" count={category.counts.exams} onClick={() => openCategory(category, 'exams')} />
                        <RelationButton icon={ListChecks} label="Question sets" count={category.counts.questionSets} onClick={() => openCategory(category, 'question-sets')} />
                        <RelationButton icon={HelpCircle} label="Questions" count={category.counts.questions} onClick={() => openCategory(category, 'questions')} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActiveBadge active={category.isActive} />
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
                        disabled={total > 0}
                        title={total > 0 ? 'This category still has exams or questions. Deactivate it instead of deleting.' : 'Delete category'}
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </ListPanel>

      {relations.element}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the details for this exam category.' : 'Create a new exam category for candidates to browse.'}
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
              <Input id="fullForm" placeholder="e.g. West Bengal Food Sub-Inspector Exam" error={!!errors.fullForm} {...register('fullForm')} />
              {errors.fullForm && <p className="text-xs text-red-500">{errors.fullForm.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Short description of this exam category" error={!!errors.description} {...register('description')} />
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
            <DialogTitle>Delete Category</DialogTitle>
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
