'use client';

import { useCallback, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

/** Sentinel for "no filter" — Radix Select cannot hold an empty-string value. */
export const ALL = 'all';

/**
 * Search + dropdown filters + page/page-size for one blog admin list. Each
 * page builds its own strongly-typed API params from these pieces (via
 * `debouncedSearch`), rather than a shared `params` blob — the three blog
 * lists (blogs, categories, comments) each send different fields.
 */
export function useBlogListState<F extends Record<string, string>>(initialFilters: F, defaultPageSize = 10) {
  const [search, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(search, 400).trim();
  const [filters, setFiltersValue] = useState<F>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeValue] = useState(defaultPageSize);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setFilters = useCallback((patch: Partial<F>) => {
    setFiltersValue((current) => ({ ...current, ...patch }));
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeValue(size);
    setPage(1);
  }, []);

  const clear = useCallback(() => {
    setSearchValue('');
    setFiltersValue(initialFilters);
    setPage(1);
  }, [initialFilters]);

  const hasFilters =
    Boolean(search.trim()) || Object.keys(initialFilters).some((key) => filters[key] !== initialFilters[key]);

  return { search, setSearch, filters, setFilters, page, setPage, pageSize, setPageSize, clear, hasFilters, debouncedSearch };
}

export type BlogListState<F extends Record<string, string> = Record<string, string>> = ReturnType<
  typeof useBlogListState<F>
>;
