import { useCallback } from 'react';
import type { SearchFilters } from '../../../shared/types';
import { libraryService } from '../services/library.service';
import { youTubeService } from '../services/youtube.service';
import { useAppDispatch, useAppSelector } from '../store';
import { addRecentSearch, clearSearch, setFilters, setLoading, setLocalResults, setQuery, setYouTubeLoading, setYouTubeResults } from '../store/slices/search.slice';

export function useSearch() {
  const dispatch = useAppDispatch();
  const { query, localResults, youtubeResults, filters, loading, youtubeLoading, recentSearches } = useAppSelector(
    (state) => state.search
  );

  const searchLocal = useCallback(async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
    dispatch(setLoading(true));
    try {
      const results = await libraryService.search(searchQuery, searchFilters);
      dispatch(setLocalResults(results));
    } catch (err) {
      console.error('Failed to search local library:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const searchYouTube = useCallback(async (searchQuery: string) => {
    dispatch(setYouTubeLoading(true));
    try {
      const results = await youTubeService.search(searchQuery);
      dispatch(setYouTubeResults(results));
    } catch (err) {
      console.error('Failed to search YouTube:', err);
    } finally {
      dispatch(setYouTubeLoading(false));
    }
  }, [dispatch]);

  const search = useCallback(async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
    dispatch(setQuery(searchQuery));
    
    if (searchQuery.trim() === '') {
      dispatch(clearSearch());
      return;
    }

    dispatch(addRecentSearch(searchQuery));

    if (searchFilters?.tracks !== false || searchFilters?.albums !== false || searchFilters?.artists !== false) {
      await searchLocal(searchQuery, searchFilters);
    }

    if (searchFilters?.youtube !== false) {
      await searchYouTube(searchQuery);
    }
  }, [dispatch, searchLocal, searchYouTube]);

  const clear = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const setSearchQuery = useCallback((newQuery: string) => {
    dispatch(setQuery(newQuery));
  }, [dispatch]);

  return {
    query,
    localResults,
    youtubeResults,
    filters,
    loading,
    youtubeLoading,
    recentSearches,
    search,
    searchLocal,
    searchYouTube,
    clear,
    updateFilters,
    setSearchQuery,
  };
}
