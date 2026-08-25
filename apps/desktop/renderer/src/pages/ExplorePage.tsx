import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { Genre, YouTubeVideo } from '@shared/types';
import { useEffect, useState } from 'react';
import YouTubeSearch from '../components/youtube/YouTubeSearch';
import GenreList from '../components/library/GenreList';
import { useLibrary } from '../hooks/useLibrary';
import { useYouTube } from '../hooks/useYouTube';

type ExploreTab = 'discover' | 'youtube';

export default function ExplorePage() {
  const { search, loading, error } = useYouTube();
  const { loadGenres } = useLibrary();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [activeTab, setActiveTab] = useState<ExploreTab>('discover');

  useEffect(() => {
    const loadData = async () => setGenres(await loadGenres());
    void loadData();
  }, [loadGenres]);

  const handleSearch = async (query: string) => {
    const result = await search(query, { type: 'video', limit: 20 });
    setVideos(result.videos);
  };

  return (
    <Box sx={{ p: 2.5, overflowY: 'auto', height: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
        <Button variant={activeTab === 'discover' ? 'contained' : 'text'} onClick={() => setActiveTab('discover')}>Descubrir</Button>
        <Button variant={activeTab === 'youtube' ? 'contained' : 'text'} onClick={() => setActiveTab('youtube')}>Fuentes externas</Button>
      </Stack>

      {activeTab === 'discover' ? (
        <section>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Explorar por género</Typography>
          {genres.length > 0 ? (
            <GenreList genres={genres} onGenreClick={(genre) => console.info('Genre selected:', genre.name)} />
          ) : (
            <Card variant="outlined" sx={{ bgcolor: 'background.elevated' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MusicNoteIcon color="primary" />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Aún no hay géneros indexados</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Escanea tu biblioteca local para construir esta sección.</Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </section>
      ) : (
        <section>
          <YouTubeSearch onSearch={(query) => void handleSearch(query)} loading={loading} />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
            {videos.map((video) => (
              <Card key={video.id} variant="outlined" sx={{ bgcolor: 'background.elevated' }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600 }} noWrap>{video.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{video.channelTitle}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.muted' }}>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </section>
      )}
    </Box>
  );
}
