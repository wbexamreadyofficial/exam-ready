'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

import { Autocomplete } from '@/components/ui/autocomplete';
import { Badge } from '@/components/ui/badge';
import { blogCategoriesApi } from '@/lib/api/blogCategories';
import { getErrorMessage } from '@/lib/api/errors';
import type { BlogCategory } from '@/types/blogCategory';

/** Only `_id`/`name` are guaranteed — a blog's populated `category` ref carries just those plus `slug`. */
export type SelectableCategory = Pick<BlogCategory, '_id' | 'name'> & Partial<BlogCategory>;

type ComboOption = { kind: 'category'; category: SelectableCategory } | { kind: 'create'; name: string };

interface CategoryComboboxProps {
  value: SelectableCategory | null;
  onChange: (category: SelectableCategory | null) => void;
  className?: string;
}

/** Search existing blog categories, or type a name that doesn't exist yet to create it on the fly. */
export function CategoryCombobox({ value, onChange, className }: CategoryComboboxProps) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchOptions = async (query: string): Promise<ComboOption[]> => {
    const { categories } = await blogCategoriesApi.getCategories({ search: query || undefined, limit: 8 });
    const options: ComboOption[] = categories.map((category) => ({ kind: 'category', category }));

    const trimmed = query.trim();
    const exactMatch = categories.some((category) => category.name.toLowerCase() === trimmed.toLowerCase());
    if (trimmed && !exactMatch) options.push({ kind: 'create', name: trimmed });

    return options;
  };

  const selected: ComboOption | null = value ? { kind: 'category', category: value } : null;

  const handleSelect = async (option: ComboOption | null) => {
    if (!option) {
      onChange(null);
      return;
    }
    if (option.kind === 'category') {
      onChange(option.category);
      return;
    }

    setCreating(true);
    try {
      const category = await blogCategoriesApi.findOrCreateCategory(option.name);
      queryClient.invalidateQueries({ queryKey: ['autocomplete', 'blog-categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      onChange(category);
      toast.success(`Category "${category.name}" is ready`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Could not create category'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Autocomplete<ComboOption>
        className={className}
        queryKey="blog-categories"
        fetchOptions={fetchOptions}
        getOptionKey={(option) => (option.kind === 'category' ? option.category._id : `create:${option.name}`)}
        inputValue={inputValue}
        onInputChange={setInputValue}
        selected={selected}
        onSelect={handleSelect}
        placeholder="Search categories, or type a new name…"
        ariaLabel="Blog category"
        heading={(query) => (query ? 'Matching categories' : 'All categories')}
        emptyLabel="No categories yet — type a name above to create one"
        renderOption={(option) =>
          option.kind === 'category' ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{option.category.name}</span>
              {!option.category.isActive && (
                <Badge variant="secondary" className="text-[9px]">
                  INACTIVE
                </Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-cta)]">
              <Plus className="h-3.5 w-3.5" /> Create &ldquo;{option.name}&rdquo;
            </div>
          )
        }
        renderSelected={(option) =>
          option.kind === 'category' ? (
            <span className="truncate text-sm font-semibold">{option.category.name}</span>
          ) : (
            <span className="truncate text-sm font-semibold">{option.name}</span>
          )
        }
      />
      {creating && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
          <Loader2 className="h-3 w-3 animate-spin" /> Creating category…
        </p>
      )}
    </div>
  );
}
