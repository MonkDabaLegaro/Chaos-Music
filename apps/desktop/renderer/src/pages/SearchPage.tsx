import { useCallback, useState } from 'react';
import SearchInput from '../components/common/SearchInput';
import AlbumGrid from '../components/library/AlbumGrid';
import ArtistGrid from '../components/library/ArtistGrid';
import TrackList from '../components/library/TrackList';
import { usePlayer } from '../hooks/usePlayer';
import { useQueue } from '../hooks/useQueue';
import { useSearch } from '../hooks/useSearch';

export default function SearchPage() {
  const { 
    query, 
    setSearchQuery, 
    search, 
    localResults, 
    youtubeResults, 
    filters, 
    updateFilters,
    loading, 
    youtubeLoading,
    recentSearches 
  } = useSearch();
  const { playTrack, playTracks } = usePlayer();
  const { addToQueue } = useQueue();
  
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim()) {
      await search(searchQuery, filters);
    }
  }, [search, filters]);

  const handleQuickSearch = async (quickQuery: string) => {
    setSearchQuery(quickQuery);
    await search(quickQuery, filters);
  };

  const filterOptions = [
    { id: 'tracks', label: 'Canciones', checked: filters.tracks },
    { id: 'albums', label: 'Álbums', checked: filters.albums },
    { id: 'artists', label: 'Artistas', checked: filters.artists },
    { id: 'youtube', label: 'YouTube', checked: filters.youtube },
  ];

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '24px' }}>
        <SearchInput
          value={query}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Buscar canciones, artistas, albums..."
          autoFocus
        />

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--surface-variant)',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          Filtros {showFilters ? '▼' : '▶'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div style={{ 
            marginTop: '12px', 
            padding: '16px', 
            background: 'var(--surface)',
            borderRadius: '8px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {filterOptions.map(option => (
              <label 
                key={option.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={() => updateFilters({ [option.id]: !option.checked })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {(loading || youtubeLoading) && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <span>Buscando...</span>
        </div>
      )}

      {/* Results */}
      {!loading && !youtubeLoading && query && (
        <>
          {/* Local Results */}
          {(filters.tracks || filters.albums || filters.artists) && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Resultados locales
              </h2>

              {filters.tracks && localResults.tracks.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    Canciones ({localResults.tracks.length})
                  </h3>
                  <TrackList 
                    tracks={localResults.tracks}
                    showAlbum={true}
                    showArtist={true}
                    onTrackClick={playTrack}
                    onAddToQueue={addToQueue}
                  />
                </div>
              )}

              {filters.albums && localResults.albums.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    Álbums ({localResults.albums.length})
                  </h3>
                  <AlbumGrid 
                    albums={localResults.albums}
                    onAlbumClick={(album) => {
                      const albumTracks = localResults.tracks.filter(t => t.albumId === album.id);
                      playTracks(albumTracks);
                    }}
                    onAddToQueue={(album) => {
                      const albumTracks = localResults.tracks.filter(t => t.albumId === album.id);
                      addToQueue(albumTracks);
                    }}
                  />
                </div>
              )}

              {filters.artists && localResults.artists.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    Artistas ({localResults.artists.length})
                  </h3>
                  <ArtistGrid 
                    artists={localResults.artists}
                    onArtistClick={(artist) => {
                      const artistTracks = localResults.tracks.filter(t => t.artist === artist.name);
                      playTracks(artistTracks);
                    }}
                  />
                </div>
              )}

              {localResults.tracks.length === 0 && 
               localResults.albums.length === 0 && 
               localResults.artists.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>
                  No se encontraron resultados locales
                </p>
              )}
            </div>
          )}

          {/* YouTube Results */}
          {filters.youtube && (youtubeResults.videos.length > 0 || youtubeResults.playlists.length > 0) && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                YouTube
              </h2>

              {youtubeResults.videos.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                    Videos ({youtubeResults.videos.length})
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '16px' 
                  }}>
                    {youtubeResults.videos.slice(0, 12).map(video => (
                      <div 
                        key={video.id}
                        style={{ 
                          background: 'var(--surface)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ 
                          width: '100%', 
                          aspectRatio: '16/9',
                          background: 'var(--surface-variant)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '32px' }}>▶️</span>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ 
                            fontWeight: 'bold', 
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {video.title}
                          </h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {video.channelTitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {query && localResults.tracks.length === 0 && 
           localResults.albums.length === 0 && 
           localResults.artists.length === 0 &&
           youtubeResults.videos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                No se encontraron resultados para "{query}"
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Intenta con otras palabras clave
              </p>
            </div>
          )}
        </>
      )}

      {/* Recent searches */}
      {!query && recentSearches.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Búsquedas recientes
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((searchTerm, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(searchTerm)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--surface-variant)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                {searchTerm}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!query && recentSearches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            Busca tu música favorita
          </p>
          <p>
            Encuentra canciones, artistas y albums en tu biblioteca y en YouTube
          </p>
        </div>
      )}
    </div>
  );
}
