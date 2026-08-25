import { Box } from '@mui/material';
import React from 'react';
import AlbumCard, { AlbumCardProps } from './AlbumCard';

interface AlbumGridProps {
  albums?: AlbumCardProps[];
  onAlbumClick?: (albumId: string) => void;
  onAlbumPlay?: (albumId: string) => void;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums = [], onAlbumClick, onAlbumPlay }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)',
        },
        gap: 3,
      }}
    >
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          {...album}
          onClick={() => onAlbumClick?.(album.id)}
          onPlay={() => onAlbumPlay?.(album.id)}
        />
      ))}
    </Box>
  );
};

export default AlbumGrid;
