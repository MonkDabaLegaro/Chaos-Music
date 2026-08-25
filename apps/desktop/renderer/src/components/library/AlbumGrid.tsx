import { Box } from '@mui/material';
import type { Album } from '@shared/types';
import React from 'react';
import AlbumCard from './AlbumCard';

interface AlbumGridProps {
  albums?: Album[];
  onAlbumClick?: (album: Album) => void;
  onAlbumPlay?: (album: Album) => void;
  onAddToQueue?: (album: Album) => void;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums = [], onAlbumClick, onAlbumPlay, onAddToQueue }) => (
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
        id={album.id}
        title={album.name}
        artist={album.artistName || 'Artista desconocido'}
        coverArt={album.coverPath}
        year={album.releaseYear ? String(album.releaseYear) : undefined}
        onClick={() => onAlbumClick?.(album)}
        onPlay={() => onAlbumPlay?.(album)}
        onAddToQueue={() => onAddToQueue?.(album)}
      />
    ))}
  </Box>
);

export default AlbumGrid;
