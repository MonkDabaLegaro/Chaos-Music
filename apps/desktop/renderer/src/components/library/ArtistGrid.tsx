import { Box } from '@mui/material';
import type { Artist } from '@shared/types';
import React from 'react';
import ArtistCard from './ArtistCard';

interface ArtistGridProps {
  artists?: Artist[];
  onArtistClick?: (artist: Artist) => void;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({ artists = [], onArtistClick }) => (
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
    {artists.map((artist) => (
      <ArtistCard
        key={artist.id}
        id={artist.id}
        name={artist.name}
        image={artist.imagePath}
        onClick={() => onArtistClick?.(artist)}
      />
    ))}
  </Box>
);

export default ArtistGrid;
