/**
 * Pruebas Unitarias para LibrarySlice
 */

import librarySlice, {
    addTrack,
    clearLibrary,
    fetchAlbums,
    fetchArtists,
    fetchGenres,
    fetchLibraryStats,
    fetchPlaylists,
    fetchTracks,
    removeTrack,
    setAlbums,
    setArtists,
    setError,
    setGenres,
    setPlaylists,
    setSelectedAlbumId,
    setSelectedArtistId,
    setSelectedGenre,
    setTracks,
    updateTrack,
} from '../library.slice';

describe('librarySlice', () => {
  const initialState = {
    tracks: [],
    albums: [],
    artists: [],
    genres: [],
    playlists: [],
    stats: null,
    loading: false,
    error: null,
    selectedArtistId: null,
    selectedAlbumId: null,
    selectedGenre: null,
  };

  describe('acciones síncronas', () => {
    it('debería retornar el estado inicial', () => {
      const state = librarySlice(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    it('debería setear tracks', () => {
      const tracks = [
        { id: '1', title: 'Track 1', duration: 180 },
        { id: '2', title: 'Track 2', duration: 200 },
      ] as any[];
      const state = librarySlice(initialState, setTracks(tracks));
      expect(state.tracks).toEqual(tracks);
    });

    it('debería setear albums', () => {
      const albums = [
        { id: '1', name: 'Album 1', trackCount: 10 },
        { id: '2', name: 'Album 2', trackCount: 8 },
      ] as any[];
      const state = librarySlice(initialState, setAlbums(albums));
      expect(state.albums).toEqual(albums);
    });

    it('debería setear artists', () => {
      const artists = [
        { id: '1', name: 'Artist 1', trackCount: 20 },
        { id: '2', name: 'Artist 2', trackCount: 15 },
      ] as any[];
      const state = librarySlice(initialState, setArtists(artists));
      expect(state.artists).toEqual(artists);
    });

    it('debería setear genres', () => {
      const genres = [
        { id: '1', name: 'Rock', trackCount: 50 },
        { id: '2', name: 'Pop', trackCount: 30 },
      ] as any[];
      const state = librarySlice(initialState, setGenres(genres));
      expect(state.genres).toEqual(genres);
    });

    it('debería setear playlists', () => {
      const playlists = [
        { id: '1', name: 'Playlist 1', trackCount: 15 },
        { id: '2', name: 'Playlist 2', trackCount: 25 },
      ] as any[];
      const state = librarySlice(initialState, setPlaylists(playlists));
      expect(state.playlists).toEqual(playlists);
    });

    it('debería setear selectedArtistId', () => {
      const state = librarySlice(initialState, setSelectedArtistId('artist-123'));
      expect(state.selectedArtistId).toBe('artist-123');
    });

    it('debería setear selectedAlbumId', () => {
      const state = librarySlice(initialState, setSelectedAlbumId('album-123'));
      expect(state.selectedAlbumId).toBe('album-123');
    });

    it('debería setear selectedGenre', () => {
      const state = librarySlice(initialState, setSelectedGenre('Rock'));
      expect(state.selectedGenre).toBe('Rock');
    });

    it('debería agregar un track al inicio', () => {
      const existingTrack = { id: '1', title: 'Track 1', duration: 180 } as any;
      const newTrack = { id: '2', title: 'Track 2', duration: 200 } as any;
      const state = librarySlice(
        { ...initialState, tracks: [existingTrack] },
        addTrack(newTrack)
      );
      expect(state.tracks).toHaveLength(2);
      expect(state.tracks[0].id).toBe('2');
    });

    it('debería actualizar un track existente', () => {
      const track1 = { id: '1', title: 'Track 1', duration: 180 } as any;
      const updatedTrack = { id: '1', title: 'Track 1 Updated', duration: 200 } as any;
      const state = librarySlice(
        { ...initialState, tracks: [track1] },
        updateTrack(updatedTrack)
      );
      expect(state.tracks[0].title).toBe('Track 1 Updated');
    });

    it('debería remover un track por ID', () => {
      const track1 = { id: '1', title: 'Track 1', duration: 180 } as any;
      const track2 = { id: '2', title: 'Track 2', duration: 200 } as any;
      const state = librarySlice(
        { ...initialState, tracks: [track1, track2] },
        removeTrack('1')
      );
      expect(state.tracks).toHaveLength(1);
      expect(state.tracks[0].id).toBe('2');
    });

    it('debería limpiar toda la biblioteca', () => {
      const state = librarySlice(
        {
          ...initialState,
          tracks: [{ id: '1', title: 'Track 1' }] as any[],
          albums: [{ id: '1', name: 'Album 1' }] as any[],
          artists: [{ id: '1', name: 'Artist 1' }] as any[],
          genres: [{ id: '1', name: 'Rock' }] as any[],
        },
        clearLibrary()
      );
      expect(state.tracks).toHaveLength(0);
      expect(state.albums).toHaveLength(0);
      expect(state.artists).toHaveLength(0);
      expect(state.genres).toHaveLength(0);
    });

    it('debería setear error', () => {
      const state = librarySlice(initialState, setError('Network error'));
      expect(state.error).toBe('Network error');
    });

    it('debería clear error con null', () => {
      const state = librarySlice(
        { ...initialState, error: 'Previous error' },
        setError(null)
      );
      expect(state.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    describe('fetchTracks', () => {
      it('debería setear loading en pending', () => {
        const state = librarySlice(initialState, fetchTracks.pending);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('debería actualizar tracks en fulfilled', () => {
        const tracks = [{ id: '1', title: 'Track 1' }] as any[];
        const state = librarySlice(initialState, fetchTracks.fulfilled(tracks, undefined));
        expect(state.loading).toBe(false);
        expect(state.tracks).toEqual(tracks);
      });

      it('debería setear error en rejected', () => {
        const state = librarySlice(initialState, fetchTracks.rejected(new Error('Failed')));
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed');
      });
    });

    describe('fetchAlbums', () => {
      it('debería setear loading en pending', () => {
        const state = librarySlice(initialState, fetchAlbums.pending);
        expect(state.loading).toBe(true);
      });

      it('debería actualizar albums en fulfilled', () => {
        const albums = [{ id: '1', name: 'Album 1' }] as any[];
        const state = librarySlice(initialState, fetchAlbums.fulfilled(albums, undefined));
        expect(state.albums).toEqual(albums);
      });
    });

    describe('fetchArtists', () => {
      it('debería actualizar artists en fulfilled', () => {
        const artists = [{ id: '1', name: 'Artist 1' }] as any[];
        const state = librarySlice(initialState, fetchArtists.fulfilled(artists, undefined));
        expect(state.artists).toEqual(artists);
      });
    });

    describe('fetchGenres', () => {
      it('debería actualizar genres en fulfilled', () => {
        const genres = [{ id: '1', name: 'Rock' }] as any[];
        const state = librarySlice(initialState, fetchGenres.fulfilled(genres));
        expect(state.genres).toEqual(genres);
      });
    });

    describe('fetchPlaylists', () => {
      it('debería actualizar playlists en fulfilled', () => {
        const playlists = [{ id: '1', name: 'Playlist 1' }] as any[];
        const state = librarySlice(initialState, fetchPlaylists.fulfilled(playlists));
        expect(state.playlists).toEqual(playlists);
      });
    });

    describe('fetchLibraryStats', () => {
      it('debería actualizar stats en fulfilled', () => {
        const stats = {
          totalTracks: 100,
          totalArtists: 20,
          totalAlbums: 30,
          totalGenres: 10,
          totalDuration: 36000,
          totalSize: 1024000,
        };
        const state = librarySlice(initialState, fetchLibraryStats.fulfilled(stats));
        expect(state.stats).toEqual(stats);
      });
    });
  });
});
