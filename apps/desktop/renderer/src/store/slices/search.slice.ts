import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Album, Artist, SearchFilters, SearchResult, Track, YouTubePlaylist, YouTubeVideo } from '@shared/types';

interface SearchState {
  query: string;
  results: SearchResult[];
  youtubeResults: { videos: YouTubeVideo[]; playlists: YouTubePlaylist[] };
  localResults: { tracks: Track[]; albums: Album[]; artists: Artist[] };
  filters: SearchFilters;
  loading: boolean;
  youtubeLoading: boolean;
  recentSearches: string[];
  suggestions: string[];
}

const initialState: SearchState = {
  query: '',
  results: [],
  youtubeResults: { videos: [], playlists: [] },
  localResults: { tracks: [], albums: [], artists: [] },
  filters: { tracks: true, albums: true, artists: true, playlists: true, youtube: true },
  loading: false,
  youtubeLoading: false,
  recentSearches: [],
  suggestions: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => { state.query = action.payload; },
    setResults: (state, action: PayloadAction<SearchResult[]>) => { state.results = action.payload; },
    setLocalResults: (state, action: PayloadAction<{ tracks: Track[]; albums: Album[]; artists: Artist[] }>) => { state.localResults = action.payload; },
    setYouTubeResults: (state, action: PayloadAction<{ videos: YouTubeVideo[]; playlists: YouTubePlaylist[] }>) => { state.youtubeResults = action.payload; },
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => { state.filters = { ...state.filters, ...action.payload }; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setYouTubeLoading: (state, action: PayloadAction<boolean>) => { state.youtubeLoading = action.payload; },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = [action.payload, ...state.recentSearches.filter((search) => search !== action.payload)].slice(0, 10);
    },
    clearRecentSearches: (state) => { state.recentSearches = []; },
    setSuggestions: (state, action: PayloadAction<string[]>) => { state.suggestions = action.payload; },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.youtubeResults = { videos: [], playlists: [] };
      state.localResults = { tracks: [], albums: [], artists: [] };
    },
  },
});

export const {
  setQuery,
  setResults,
  setLocalResults,
  setYouTubeResults,
  setFilters,
  setLoading,
  setYouTubeLoading,
  addRecentSearch,
  clearRecentSearches,
  setSuggestions,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
