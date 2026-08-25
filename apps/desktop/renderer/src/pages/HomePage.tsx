import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useEffect, useState } from 'react';
import type { Album, Artist, LibraryStats, Playlist, RecentlyAdded, RecentlyPlayed } from '@shared/types';
import AlbumGrid from '../components/library/AlbumGrid';
import ArtistGrid from '../components/library/ArtistGrid';
import TrackList from '../components/library/TrackList';
import { useLibrary } from '../hooks/useLibrary';
import { usePlayer } from '../hooks/usePlayer';
import { useQueue } from '../hooks/useQueue';
import { ipcService } from '../services/ipc.service';

export default function HomePage() {
  const { loadRecentlyAdded, loadRecentlyPlayed, loadStats, loadAlbums, loadArtists, loadPlaylists } = useLibrary();
  const { playTrack, playTracks } = usePlayer();
  const { addToQueue } = useQueue();

  const [recentlyAdded, setRecentlyAdded] = useState<RecentlyAdded[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recentlyAddedData, recentlyPlayedData, statsData, albumsData, artistsData, playlistsData] = await Promise.all([
          loadRecentlyAdded(10),
          loadRecentlyPlayed(10),
          loadStats(),
          loadAlbums({ limit: 6 }),
          loadArtists({ limit: 6 }),
          loadPlaylists(),
        ]);
        setRecentlyAdded(recentlyAddedData);
        setRecentlyPlayed(recentlyPlayedData);
        setStats(statsData);
        setAlbums(albumsData);
        setArtists(artistsData);
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [loadRecentlyAdded, loadRecentlyPlayed, loadStats, loadAlbums, loadArtists, loadPlaylists]);

  const handlePlayAlbum = async (album: Album) => {
    const response = await ipcService.getTracks({ albumId: album.id });
    if (response.success && response.data) await playTracks(response.data);
  };

  const handleAddAlbumToQueue = async (album: Album) => {
    const response = await ipcService.getTracks({ albumId: album.id });
    if (response.success && response.data) await addToQueue(response.data);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <section style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Chaos Music</h1>
        {stats && (
          <p style={{ color: 'var(--text-secondary)' }}>
            {stats.totalTracks} canciones • {stats.totalArtists} artistas • {stats.totalAlbums} álbumes
          </p>
        )}
      </section>

      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Añadidos recientemente</h2>
          <button onClick={() => void playTracks(recentlyAdded.map((item) => item.track))}>Reproducir todo</button>
        </div>
        <TrackList
          tracks={recentlyAdded.map((item) => item.track)}
          onTrackClick={(track) => void playTrack(track)}
          onTrackPlay={(track) => void playTrack(track)}
          onAddToQueue={(track) => void addToQueue(track)}
        />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Álbumes destacados</h2>
        <AlbumGrid
          albums={albums}
          onAlbumClick={(album) => void handlePlayAlbum(album)}
          onAlbumPlay={(album) => void handlePlayAlbum(album)}
          onAddToQueue={(album) => void handleAddAlbumToQueue(album)}
        />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Artistas</h2>
        <ArtistGrid artists={artists} onArtistClick={(artist) => console.info('Artist selected:', artist.name)} />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Reproducido recientemente</h2>
          <button onClick={() => void playTracks(recentlyPlayed.map((item) => item.track))}>Reproducir todo</button>
        </div>
        <TrackList
          tracks={recentlyPlayed.map((item) => item.track)}
          onTrackClick={(track) => void playTrack(track)}
          onTrackPlay={(track) => void playTrack(track)}
          onAddToQueue={(track) => void addToQueue(track)}
        />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Tus playlists</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {playlists.slice(0, 6).map((playlist) => (
            <div key={playlist.id} style={{ padding: '16px', background: 'var(--surface)', borderRadius: '8px' }}>
              <div style={{ width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center', background: 'var(--surface-variant)', borderRadius: '4px', marginBottom: '12px' }}>
                <QueueMusicIcon fontSize="large" />
              </div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{playlist.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{playlist.trackCount} canciones</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
