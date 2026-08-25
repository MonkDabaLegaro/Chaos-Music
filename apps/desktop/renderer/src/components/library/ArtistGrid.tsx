import { Box } from '@mui/material';
import React from 'react';
import ArtistCard, { ArtistCardProps } from './ArtistCard';

interface ArtistGridProps {
  artists?: ArtistCardProps[];
  onArtistClick?: (artistId: string) => void;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({ artists = [], onArtistClick }) => {
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
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          {...artist}
          onClick={() => onArtistClick?.(artist.id)}
        />
      ))}
    </Box>
  );
};

export default ArtistGrid;
