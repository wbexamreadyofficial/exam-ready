'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { CatalogListParams } from '@/lib/api/catalog';

/** Sentinel for "no filter" — Radix Select cannot hold an empty-string value. */
export const ALL = 'all';

/**
 * Search + dropdown filters + page/page-size for one list. Every change other
 * than the page itself sends the list back to page 1. `params` is what gets
 * sent to the backend, which does all the searching, filtering and paging.
 */
export function useListState<F extends Record<string, string>>(initialFilters: F, defaultPageSize = 10) {
  const [search, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(search, 400);
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
    // `initialFilters` is a fresh literal each render in callers; the values it holds are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialFilters)]);

  const hasFilters =
    Boolean(search.trim()) || Object.keys(initialFilters).some((key) => filters[key] !== initialFilters[key]);

  const params = useMemo<CatalogListParams>(() => {
    const next: Record<string, string | number | undefined> = {
      search: debouncedSearch.trim() || undefined,
      page,
      limit: pageSize,
    };
    for (const [key, value] of Object.entries(filters)) next[key] = value === ALL ? undefined : value;
    return next as CatalogListParams;
  }, [debouncedSearch, filters, page, pageSize]);

  return { search, setSearch, filters, setFilters, page, setPage, pageSize, setPageSize, clear, hasFilters, params };
}

export type ListState<F extends Record<string, string> = Record<string, string>> = ReturnType<typeof useListState<F>>;
