import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ id, name, image, onClick }) => {
  return (
    <Card
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.elevated',
          '& .artist-play-button': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={image}
          sx={{
            width: '100%',
            aspectRatio: '1',
            fontSize: '3rem',
            bgcolor: 'background.elevated',
            mx: 'auto',
          }}
        >
          👤
        </Avatar>

        {/* Play Button Overlay */}
        <Box
          className="artist-play-button"
          onClick={onClick}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'black',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'primary.light',
              transform: 'scale(1.05)',
            },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 28 }} />
        </Box>
      </Box>

      <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
