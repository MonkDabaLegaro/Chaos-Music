import { useEffect, useState } from 'react';
import AlbumGrid from '../components/library/AlbumGrid';
import ArtistGrid from '../components/library/ArtistGrid';
import GenreList from '../components/library/GenreList';
import TrackList from '../components/library/TrackList';
import PlaylistList from '../components/playlist/PlaylistList';
import { useLibrary } from '../hooks/useLibrary';
import { usePlayer } from '../hooks/usePlayer';
import { useQueue } from '../hooks/useQueue';

export default function LibraryPage() {
  const { loadTracks, loadAlbums, loadArtists, loadGenres, loadPlaylists } = useLibrary();
  const { playTrack, playTracks } = usePlayer();
  const { addToQueue } = useQueue();
  
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'artists' | 'genres' | 'playlists'>('songs');
  const [tracks, setTracks] = useState<import('../../../../shared/types').Track[]>([]);
  const [albums, setAlbums] = useState<import('../../../../shared/types').Album[]>([]);
  const [artists, setArtists] = useState<import('../../../../shared/types').Artist[]>([]);
  const [genres, setGenres] = useState<Array<{ id: string; name: string; trackCount: number }>>([]);
  const [playlists, setPlaylists] = useState<import('../../../../shared/types').Playlist[]>([]);
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
      } catch (err) {
        console.error('Failed to load library data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadTracks, loadAlbums, loadArtists, loadGenres, loadPlaylists]);

  const tabs = [
    { id: 'songs', label: 'Canciones', icon: '🎵' },
    { id: 'albums', label: 'Álbums', icon: '💿' },
    { id: 'artists', label: 'Artistas', icon: '👤' },
    { id: 'genres', label: 'Géneros', icon: '🎸' },
    { id: 'playlists', label: 'Playlists', icon: '📋' },
  ] as const;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <span>Cargando biblioteca...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--on-primary)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'songs' && (
        <TrackList 
          tracks={tracks}
          showAlbum={true}
          showArtist={true}
          showGenre={true}
          onTrackClick={playTrack}
          onAddToQueue={addToQueue}
          onPlayAll={() => playTracks(tracks)}
        />
      )}

      {activeTab === 'albums' && (
        <AlbumGrid 
          albums={albums}
          onAlbumClick={(album) => {
            const albumTracks = tracks.filter(t => t.albumId === album.id);
            playTracks(albumTracks);
          }}
          onAddToQueue={(album) => {
            const albumTracks = tracks.filter(t => t.albumId === album.id);
            addToQueue(albumTracks);
          }}
        />
      )}

      {activeTab === 'artists' && (
        <ArtistGrid 
          artists={artists}
          onArtistClick={(artist) => {
            const artistTracks = tracks.filter(t => t.artist === artist.name);
            playTracks(artistTracks);
          }}
        />
      )}

      {activeTab === 'genres' && (
        <GenreList 
          genres={genres}
          onGenreClick={(genre) => {
            const genreTracks = tracks.filter(t => t.genre === genre.name);
            playTracks(genreTracks);
          }}
        />
      )}

      {activeTab === 'playlists' && (
        <PlaylistList 
          playlists={playlists}
          onPlaylistClick={(playlist) => {
            console.log('Playlist clicked:', playlist);
          }}
          onCreatePlaylist={() => {
            console.log('Create playlist');
          }}
        />
      )}
    </div>
  );
}
