import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { Avatar, Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

export interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  year?: string;
  onClick?: () => void;
  onPlay?: () => void;
  onAddToQueue?: () => void;
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
  onAddToQueue,
  onMore,
}) => (
  <Card
    data-album-id={id}
    onClick={onClick}
    sx={{
      bgcolor: 'transparent',
      boxShadow: 'none',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        bgcolor: 'background.elevated',
        '& .album-action': { opacity: 1, transform: 'translateY(0)' },
      },
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <Avatar
        variant="rounded"
        src={coverArt}
        sx={{ width: '100%', aspectRatio: '1', fontSize: '3rem', bgcolor: 'background.elevated' }}
      >
        <QueueMusicIcon sx={{ fontSize: 52, color: 'text.secondary' }} />
      </Avatar>

      <Tooltip title="Reproducir">
        <IconButton
          className="album-action"
          onClick={(event) => { event.stopPropagation(); onPlay?.(); }}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'background.default',
            width: 48,
            height: 48,
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'primary.light', transform: 'scale(1.04)' },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>

      {onAddToQueue && (
        <Tooltip title="Añadir a la cola">
          <IconButton
            className="album-action"
            onClick={(event) => { event.stopPropagation(); onAddToQueue(); }}
            sx={{ position: 'absolute', top: 8, right: onMore ? 48 : 8, bgcolor: 'rgba(7,11,9,0.72)', opacity: 0 }}
          >
            <QueueMusicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onMore && (
        <IconButton
          className="album-action"
          onClick={(event) => { event.stopPropagation(); onMore(); }}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(7,11,9,0.72)', opacity: 0 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
    </Box>

    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {artist} {year && `• ${year}`}
      </Typography>
    </CardContent>
  </Card>
);

export default AlbumCard;
