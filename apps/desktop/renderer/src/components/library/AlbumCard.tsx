import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import React from 'react';

export interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  year?: string;
  onClick?: () => void;
  onPlay?: () => void;
  onMore?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  id,
  title,
  artist,
  coverArt,
  year,
  onClick,
  onPlay,
  onMore,
}) => {
  return (
    <Card
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: 'background.elevated',
          '& .album-play-button': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          variant="rounded"
          src={coverArt}
          sx={{
            width: '100%',
            aspectRatio: '1',
            fontSize: '3rem',
            bgcolor: 'background.elevated',
          }}
        >
          🎵
        </Avatar>

        {/* Play Button Overlay */}
        <IconButton
          className="album-play-button"
          onClick={onPlay}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'black',
            width: 48,
            height: 48,
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'primary.light',
              transform: 'scale(1.05)',
            },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* More Button */}
        <IconButton
          onClick={onMore}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {artist} {year && `• ${year}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
