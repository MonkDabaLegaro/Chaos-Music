import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
    Avatar,
    Box,
    IconButton,
    Slider,
    Tooltip,
    Typography
} from '@mui/material';
import React from 'react';

interface NowPlayingProps {
  currentTrack?: {
    title: string;
    artist: string;
    album: string;
    albumArt?: string;
    duration?: number;
  };
  isPlaying?: boolean;
  progress?: number;
  volume?: number;
  shuffle?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  isFavorite?: boolean;
  onClose?: () => void;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgressChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onFavoriteToggle?: () => void;
}

const NowPlaying: React.FC<NowPlayingProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  volume = 80,
  shuffle = false,
  repeatMode = 'off',
  isFavorite = false,
  onClose,
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onVolumeChange,
  onShuffleToggle,
  onRepeatToggle,
  onFavoriteToggle,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = currentTrack?.duration || 240;
  const currentTime = (progress / 100) * totalDuration;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.default',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Reproduciendo ahora
        </Typography>
        <IconButton onClick={onClose}>
          <FullscreenExitIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          p: 4,
          overflow: 'auto',
        }}
      >
        {/* Album Art */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            maxWidth: 500,
            aspectRatio: '1',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            bgcolor: 'background.elevated',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            src={currentTrack?.albumArt}
            variant="rounded"
            sx={{ width: '100%', height: '100%' }}
          >
            <Typography variant="h2">🎵</Typography>
          </Avatar>
        </Box>

        {/* Track Info & Controls */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Track Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              {currentTrack?.title || 'Sin reproducir'}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: 'text.secondary', mb: 0.5 }}
            >
              {currentTrack?.artist || '-'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {currentTrack?.album || '-'}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ width: '100%', px: 2 }}>
            <Slider
              value={progress}
              onChange={(_, value) => onProgressChange?.(value as number)}
              sx={{
                color: 'primary.main',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatTime(currentTime)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatTime(totalDuration)}
              </Typography>
            </Box>
          </Box>

          {/* Controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Tooltip title="Aleatorio">
              <IconButton
                onClick={onShuffleToggle}
                sx={{
                  color: shuffle ? 'primary.main' : 'text.secondary',
                }}
              >
                <ShuffleIcon />
              </IconButton>
            </Tooltip>

            <IconButton onClick={onPrevious} sx={{ color: 'text.primary' }}>
              <SkipPreviousIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <IconButton
              onClick={onPlayPause}
              sx={{
                bgcolor: 'text.primary',
                color: 'background.default',
                '&:hover': {
                  bgcolor: 'grey.300',
                  transform: 'scale(1.05)',
                },
                width: 64,
                height: 64,
              }}
            >
              {isPlaying ? (
                <PauseIcon sx={{ fontSize: 40 }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 40 }} />
              )}
            </IconButton>

            <IconButton onClick={onNext} sx={{ color: 'text.primary' }}>
              <SkipNextIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <Tooltip title={repeatMode === 'one' ? 'Repetir una' : 'Repetir'}>
              <IconButton
                onClick={onRepeatToggle}
                sx={{
                  color:
                    repeatMode === 'off' ? 'text.secondary' : 'primary.main',
                }}
              >
                {repeatMode === 'one' ? (
                  <RepeatOneIcon />
                ) : (
                  <RepeatIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Volume & Favorite */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              px: 2,
            }}
          >
            <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
              <IconButton onClick={onFavoriteToggle} sx={{ color: isFavorite ? 'error.main' : 'text.secondary' }}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
              <VolumeUpIcon sx={{ color: 'text.secondary' }} />
              <Slider
                value={volume}
                onChange={(_, value) => onVolumeChange?.(value as number)}
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NowPlaying;
