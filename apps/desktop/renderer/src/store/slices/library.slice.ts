import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Album, Artist, Genre, LibraryStats, Playlist, Track } from '@shared/types';

interface LibraryState {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  genres: Genre[];
  playlists: Playlist[];
  stats: LibraryStats | null;
  loading: boolean;
  error: string | null;
  selectedArtistId: string | null;
  selectedAlbumId: string | null;
  selectedGenre: string | null;
}

const initialState: LibraryState = {
  tracks: [], albums: [], artists: [], genres: [], playlists: [], stats: null,
  loading: false, error: null, selectedArtistId: null, selectedAlbumId: null, selectedGenre: null,
};

export const fetchTracks = createAsyncThunk('library/fetchTracks', async (_options?: { artistId?: string; albumId?: string; genre?: string; limit?: number }) => [] as Track[]);
export const fetchAlbums = createAsyncThunk('library/fetchAlbums', async (_options?: { artistId?: string; genre?: string; limit?: number }) => [] as Album[]);
export const fetchArtists = createAsyncThunk('library/fetchArtists', async (_options?: { genre?: string; limit?: number }) => [] as Artist[]);
export const fetchGenres = createAsyncThunk('library/fetchGenres', async () => [] as Genre[]);
export const fetchPlaylists = createAsyncThunk('library/fetchPlaylists', async () => [] as Playlist[]);
export const fetchLibraryStats = createAsyncThunk('library/fetchStats', async () => ({} as LibraryStats));

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<Track[]>) => { state.tracks = action.payload; },
    setAlbums: (state, action: PayloadAction<Album[]>) => { state.albums = action.payload; },
    setArtists: (state, action: PayloadAction<Artist[]>) => { state.artists = action.payload; },
    setGenres: (state, action: PayloadAction<Genre[]>) => { state.genres = action.payload; },
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => { state.playlists = action.payload; },
    setSelectedArtistId: (state, action: PayloadAction<string | null>) => { state.selectedArtistId = action.payload; },
    setSelectedAlbumId: (state, action: PayloadAction<string | null>) => { state.selectedAlbumId = action.payload; },
    setSelectedGenre: (state, action: PayloadAction<string | null>) => { state.selectedGenre = action.payload; },
    addTrack: (state, action: PayloadAction<Track>) => { state.tracks.unshift(action.payload); },
    updateTrack: (state, action: PayloadAction<Track>) => {
      const index = state.tracks.findIndex((track) => track.id === action.payload.id);
      if (index !== -1) state.tracks[index] = action.payload;
    },
    removeTrack: (state, action: PayloadAction<string>) => { state.tracks = state.tracks.filter((track) => track.id !== action.payload); },
    clearLibrary: (state) => { state.tracks = []; state.albums = []; state.artists = []; state.genres = []; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTracks.fulfilled, (state, action) => { state.loading = false; state.tracks = action.payload; })
      .addCase(fetchTracks.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch tracks'; })
      .addCase(fetchAlbums.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAlbums.fulfilled, (state, action) => { state.loading = false; state.albums = action.payload; })
      .addCase(fetchAlbums.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch albums'; })
      .addCase(fetchArtists.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchArtists.fulfilled, (state, action) => { state.loading = false; state.artists = action.payload; })
      .addCase(fetchArtists.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch artists'; })
      .addCase(fetchGenres.fulfilled, (state, action) => { state.genres = action.payload; })
      .addCase(fetchPlaylists.fulfilled, (state, action) => { state.playlists = action.payload; })
      .addCase(fetchLibraryStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export const {
  setTracks,
  setAlbums,
  setArtists,
  setGenres,
  setPlaylists,
  setSelectedArtistId,
  setSelectedAlbumId,
  setSelectedGenre,
  addTrack,
  updateTrack,
  removeTrack,
  clearLibrary,
  setError,
} = librarySlice.actions;

export default librarySlice.reducer;
