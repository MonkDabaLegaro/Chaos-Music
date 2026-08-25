import { useEffect, useState } from 'react';
import YouTubeSearch from '../components/youtube/YouTubeSearch';
import { useLibrary } from '../hooks/useLibrary';
import { useYouTube } from '../hooks/useYouTube';

export default function ExplorePage() {
  const { search, loading, error } = useYouTube();
  const { loadGenres } = useLibrary();
  
  const [genres, setGenres] = useState<Array<{ id: string; name: string; trackCount: number }>>([]);
  const [trendingVideos, setTrendingVideos] = useState<Array<import('../../../../shared/types').YouTubeVideo>>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'youtube'>('discover');

  useEffect(() => {
    const loadData = async () => {
      const genresData = await loadGenres();
      setGenres(genresData);
    };
    loadData();
  }, [loadGenres]);

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '24px',
        borderBottom: '1px solid var(--surface-variant)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveTab('discover')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'discover' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: activeTab === 'discover' ? 'var(--on-primary)' : 'var(--text-primary)'
          }}
        >
          Descubrir
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'youtube' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: activeTab === 'youtube' ? 'var(--on-primary)' : 'var(--text-primary)'
          }}
        >
          YouTube
        </button>
      </div>

      {activeTab === 'discover' ? (
        <>
          {/* Genres section */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Géneros</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '12px' 
            }}>
              {genres.map(genre => (
                <div 
                  key={genre.id}
                  style={{ 
                    padding: '20px', 
                    background: 'var(--surface)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                    {genre.name.toLowerCase().includes('rock') ? '🎸' :
                     genre.name.toLowerCase().includes('pop') ? '🎤' :
                     genre.name.toLowerCase().includes('jazz') ? '🎷' :
                     genre.name.toLowerCase().includes('classical') ? '🎻' :
                     genre.name.toLowerCase().includes('electronic') ? '🎧' :
                     genre.name.toLowerCase().includes('hip') ? '🎧' :
                     '🎵'}
                  </span>
                  <h3 style={{ fontWeight: 'bold' }}>{genre.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {genre.trackCount} canciones
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Playlists section */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              playlists Recomendadas
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              {['Mix de Rock', 'Top Pop 2024', 'Lo-Fi Chill', 'Electrónica Moderna', 'Clásicos del Jazz', 'Música para Concentrarse'].map((name, index) => (
                <div 
                  key={index}
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
                    background: `hsl(${index * 60}, 50%, 30%)`,
                    borderRadius: '4px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '32px' }}>🎵</span>
                  </div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Playlist autogenerada
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <YouTubeSearch onSearch={search} loading={loading}>
          {error && (
            <div style={{ 
              padding: '16px', 
              background: 'var(--error)', 
              color: 'var(--on-error)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
        </YouTubeSearch>
      )}
    </div>
  );
}
