import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import {
    Avatar,
    Box,
    IconButton,
    Paper,
    Slider,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';

interface MiniPlayerProps {
  currentTrack?: {
    title: string;
    artist: string;
    albumArt?: string;
  };
  isPlaying?: boolean;
  progress?: number;
  isFavorite?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgressChange?: (value: number) => void;
  onFavoriteToggle?: () => void;
  onClose?: () => void;
  onExpand?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  isFavorite = false,
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onFavoriteToggle,
  onClose,
  onExpand,
}) => {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1000,
      }}
    >
      {/* Progress Bar */}
      <Slider
        value={progress}
        onChange={(_, value) => onProgressChange?.(value as number)}
        size="small"
        sx={{
          color: 'primary.main',
          height: 2,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            opacity: 0,
            transition: 'opacity 0.2s',
          },
          '&:hover .MuiSlider-thumb': {
            opacity: 1,
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          gap: 1,
        }}
      >
        {/* Track Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
            cursor: 'pointer',
          }}
          onClick={onExpand}
        >
          <Avatar
            variant="rounded"
            src={currentTrack?.albumArt}
            sx={{ width: 48, height: 48, mr: 1.5 }}
          />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack?.title || 'Sin reproducir'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack?.artist || '-'}
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Anterior">
            <IconButton onClick={onPrevious} size="small" color="inherit">
              <SkipPreviousIcon />
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={onPlayPause}
            sx={{
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': {
                bgcolor: 'grey.300',
              },
              width: 36,
              height: 36,
            }}
          >
            {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>

          <Tooltip title="Siguiente">
            <IconButton onClick={onNext} size="small" color="inherit">
              <SkipNextIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Extra Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
            <IconButton
              onClick={onFavoriteToggle}
              size="small"
              sx={{ color: isFavorite ? 'error.main' : 'text.secondary' }}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cerrar">
            <IconButton onClick={onClose} size="small" color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default MiniPlayer;
