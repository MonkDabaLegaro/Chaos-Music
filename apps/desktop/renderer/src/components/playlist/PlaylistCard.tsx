import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import React from 'react';

export interface PlaylistCardProps {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  trackCount?: number;
  onClick?: () => void;
  onPlay?: () => void;
  onMore?: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  id,
  name,
  description,
  coverArt,
  trackCount,
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
          '& .playlist-play-button': {
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
            bgcolor: 'background.elevated',
            fontSize: '3rem',
          }}
        >
          <PlaylistPlayIcon sx={{ fontSize: 48 }} />
        </Avatar>

        {/* Play Button Overlay */}
        <IconButton
          className="playlist-play-button"
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
          {name}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
        {trackCount !== undefined && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {trackCount} {trackCount === 1 ? 'canción' : 'canciones'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;
