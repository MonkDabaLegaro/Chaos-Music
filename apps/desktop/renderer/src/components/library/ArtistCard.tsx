import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ id, name, image, onClick }) => (
  <Card
    data-artist-id={id}
    onClick={onClick}
    sx={{
      bgcolor: 'transparent',
      boxShadow: 'none',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        bgcolor: 'background.elevated',
        '& .artist-play-button': { opacity: 1, transform: 'translateY(0)' },
      },
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <Avatar
        src={image}
        sx={{ width: '100%', aspectRatio: '1', bgcolor: 'background.elevated', mx: 'auto' }}
      >
        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      </Avatar>
      <Box
        className="artist-play-button"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          bgcolor: 'primary.main',
          color: 'background.default',
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transform: 'translateY(8px)',
          transition: 'all 0.2s ease',
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 28 }} />
      </Box>
    </Box>
    <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
      <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {name}
      </Typography>
    </CardContent>
  </Card>
);

export default ArtistCard;
