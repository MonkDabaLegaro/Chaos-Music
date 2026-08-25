import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import YouTubeVideoCard, { YouTubeVideo } from './YouTubeVideoCard';

interface YouTubeResultsProps {
  results?: YouTubeVideo[];
  loading?: boolean;
  error?: string;
  onVideoClick?: (videoId: string) => void;
  onVideoPlay?: (videoId: string) => void;
}

const YouTubeResults: React.FC<YouTubeResultsProps> = ({
  results = [],
  loading = false,
  error,
  onVideoClick,
  onVideoPlay,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No se encontraron resultados
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Intenta con otra búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {results.map((video) => (
        <YouTubeVideoCard
          key={video.id}
          {...video}
          onClick={() => onVideoClick?.(video.id)}
          onPlay={() => onVideoPlay?.(video.id)}
        />
      ))}
    </Box>
  );
};

export default YouTubeResults;
