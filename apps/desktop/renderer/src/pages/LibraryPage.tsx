import AlbumIcon from '@mui/icons-material/Album';
import CategoryIcon from '@mui/icons-material/Category';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PeopleIcon from '@mui/icons-material/People';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Button, Stack } from '@mui/material';
import type { Album, Artist, Genre, Playlist, Track } from '@shared/types';
import { useEffect, useState } from 'react';
import AlbumGrid from '../components/library/AlbumGrid';
import ArtistGrid from '../components/library/ArtistGrid';
import GenreList from '../components/library/GenreList';
import TrackList from '../components/library/TrackList';
import PlaylistList from '../components/playlist/PlaylistList';
import { useLibrary } from '../hooks/useLibrary';
import { usePlayer } from '../hooks/usePlayer';
import { useQueue } from '../hooks/useQueue';

type LibraryTab = 'songs' | 'albums' | 'artists' | 'genres' | 'playlists';

export default function LibraryPage() {
  const { loadTracks, loadAlbums, loadArtists, loadGenres, loadPlaylists } = useLibrary();
  const { playTrack, playTracks } = usePlayer();
  const { addToQueue } = useQueue();

  const [activeTab, setActiveTab] = useState<LibraryTab>('songs');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tracksData, albumsData, artistsData, genresData, playlistsData] = await Promise.all([
          loadTracks({ limit: 100 }),
          loadAlbums({ limit: 50 }),
          loadArtists({ limit: 50 }),
          loadGenres(),
          loadPlaylists(),
        ]);
        setTracks(tracksData);
        setAlbums(albumsData);
        setArtists(artistsData);
        setGenres(genresData);
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Failed to load library data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [loadTracks, loadAlbums, loadArtists, loadGenres, loadPlaylists]);

  const tabs: Array<{ id: LibraryTab; label: string; icon: React.ReactNode }> = [
    { id: 'songs', label: 'Canciones', icon: <LibraryMusicIcon fontSize="small" /> },
    { id: 'albums', label: 'Álbumes', icon: <AlbumIcon fontSize="small" /> },
    { id: 'artists', label: 'Artistas', icon: <PeopleIcon fontSize="small" /> },
    { id: 'genres', label: 'Géneros', icon: <CategoryIcon fontSize="small" /> },
    { id: 'playlists', label: 'Playlists', icon: <PlaylistPlayIcon fontSize="small" /> },
  ];

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>Cargando biblioteca...</div>;
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            startIcon={tab.icon}
            variant={activeTab === tab.id ? 'contained' : 'text'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>

      {activeTab === 'songs' && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button disabled={tracks.length === 0} onClick={() => void playTracks(tracks)}>Reproducir todo</Button>
          </Stack>
          <TrackList
            tracks={tracks}
            onTrackClick={(track) => void playTrack(track)}
            onTrackPlay={(track) => void playTrack(track)}
            onAddToQueue={(track) => void addToQueue(track)}
          />
        </>
      )}

      {activeTab === 'albums' && (
        <AlbumGrid
          albums={albums}
          onAlbumClick={(album) => void playTracks(tracks.filter((track) => track.albumId === album.id))}
          onAlbumPlay={(album) => void playTracks(tracks.filter((track) => track.albumId === album.id))}
          onAddToQueue={(album) => void addToQueue(tracks.filter((track) => track.albumId === album.id))}
        />
      )}

      {activeTab === 'artists' && (
        <ArtistGrid
          artists={artists}
          onArtistClick={(artist) => void playTracks(tracks.filter((track) => track.artist === artist.name))}
        />
      )}

      {activeTab === 'genres' && (
        <GenreList
          genres={genres}
          onGenreClick={(genre) => void playTracks(tracks.filter((track) => track.genre === genre.name))}
        />
      )}

      {activeTab === 'playlists' && (
        <PlaylistList
          playlists={playlists}
          onPlaylistClick={(playlist) => console.info('Playlist selected:', playlist.name)}
          onCreatePlaylist={() => console.info('Create playlist requested')}
        />
      )}
    </div>
  );
}
