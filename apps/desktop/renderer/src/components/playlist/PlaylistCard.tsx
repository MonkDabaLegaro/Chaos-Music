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
}) => (
  <Card
    data-playlist-id={id}
    onClick={onClick}
    sx={{
      bgcolor: 'transparent',
      boxShadow: 'none',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        bgcolor: 'background.elevated',
        '& .playlist-play-button, & .playlist-more-button': { opacity: 1 },
      },
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <Avatar variant="rounded" src={coverArt} sx={{ width: '100%', aspectRatio: '1', bgcolor: 'background.elevated' }}>
        <PlaylistPlayIcon sx={{ fontSize: 48 }} />
      </Avatar>

      <IconButton
        className="playlist-play-button"
        onClick={(event) => { event.stopPropagation(); onPlay?.(); }}
        sx={{
          position: 'absolute', bottom: 8, right: 8, bgcolor: 'primary.main', color: 'background.default',
          width: 48, height: 48, opacity: 0, transition: 'all 0.2s ease',
          '&:hover': { bgcolor: 'primary.light', transform: 'scale(1.04)' },
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {onMore && (
        <IconButton
          className="playlist-more-button"
          onClick={(event) => { event.stopPropagation(); onMore(); }}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(7, 11, 9, 0.72)', opacity: 0 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
    </Box>

    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</Typography>
      {description && <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5 }}>{description}</Typography>}
      {trackCount !== undefined && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{trackCount} {trackCount === 1 ? 'canción' : 'canciones'}</Typography>}
    </CardContent>
  </Card>
);

export default PlaylistCard;
