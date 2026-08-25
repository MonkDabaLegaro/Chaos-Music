import { useEffect, useState } from 'react';
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
  
  const [recentlyAdded, setRecentlyAdded] = useState<Array<{ track: import('../../../../shared/types').Track; addedAt: string }>>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Array<{ track: import('../../../../shared/types').Track; playedAt: string }>>([]);
  const [stats, setStats] = useState<import('../../../../shared/types').LibraryStats | null>(null);
  const [albums, setAlbums] = useState<import('../../../../shared/types').Album[]>([]);
  const [artists, setArtists] = useState<import('../../../../shared/types').Artist[]>([]);
  const [playlists, setPlaylists] = useState<import('../../../../shared/types').Playlist[]>([]);
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
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadRecentlyAdded, loadRecentlyPlayed, loadStats, loadAlbums, loadArtists, loadPlaylists]);

  const handlePlayRecentlyAdded = async () => {
    const tracks = recentlyAdded.map(item => item.track);
    await playTracks(tracks);
  };

  const handlePlayRecentlyPlayed = async () => {
    const tracks = recentlyPlayed.map(item => item.track);
    await playTracks(tracks);
  };

  const handlePlayAlbum = async (album: import('../../../../shared/types').Album) => {
    // This would need to load album tracks first
    const tracks = await ipcService.getTracks({ albumId: album.id });
    if (tracks.success && tracks.data) {
      await playTracks(tracks.data);
    }
  };

  const handleAddAlbumToQueue = async (album: import('../../../../shared/types').Album) => {
    const tracks = await ipcService.getTracks({ albumId: album.id });
    if (tracks.success && tracks.data) {
      addToQueue(tracks.data);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Welcome section */}
      <section style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          ¡Bienvenido de nuevo!
        </h1>
        {stats && (
          <p style={{ color: 'var(--text-secondary)' }}>
            {stats.totalTracks} canciones • {stats.totalArtists} artistas • {stats.totalAlbums} albums
          </p>
        )}
      </section>

      {/* Recently Added section */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Añadidos recientemente</h2>
          <button 
            onClick={handlePlayRecentlyAdded}
            style={{ 
              padding: '8px 16px', 
              background: 'var(--primary)', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reproducir todo
          </button>
        </div>
        <TrackList 
          tracks={recentlyAdded.map(item => item.track)}
          showAlbum={true}
          showArtist={true}
          onTrackClick={playTrack}
          onAddToQueue={addToQueue}
        />
      </section>

      {/* Featured Albums section */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Albums destacados</h2>
        </div>
        <AlbumGrid 
          albums={albums}
          onAlbumClick={handlePlayAlbum}
          onAddToQueue={handleAddAlbumToQueue}
        />
      </section>

      {/* Popular Artists section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Artistas populares</h2>
        <ArtistGrid 
          artists={artists}
          onArtistClick={(artist) => console.log('Artist clicked:', artist)}
        />
      </section>

      {/* Recently Played section */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Reproducido recientemente</h2>
          <button 
            onClick={handlePlayRecentlyPlayed}
            style={{ 
              padding: '8px 16px', 
              background: 'var(--primary)', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reproducir todo
          </button>
        </div>
        <TrackList 
          tracks={recentlyPlayed.map(item => item.track)}
          showAlbum={true}
          showArtist={true}
          onTrackClick={playTrack}
          onAddToQueue={addToQueue}
        />
      </section>

      {/* Your Playlists section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Tus playlists</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '16px' 
        }}>
          {playlists.slice(0, 6).map(playlist => (
            <div 
              key={playlist.id}
              style={{ 
                padding: '16px', 
                background: 'var(--surface)', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1', 
                background: 'var(--surface-variant)',
                borderRadius: '4px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>🎵</span>
              </div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{playlist.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {playlist.trackCount} canciones
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
