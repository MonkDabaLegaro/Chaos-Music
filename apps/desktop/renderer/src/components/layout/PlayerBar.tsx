import DevicesIcon from '@mui/icons-material/Devices';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
    Avatar,
    Box,
    Grid,
    IconButton,
    Paper,
    Slider,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';

interface PlayerBarProps {
  currentTrack?: {
    title: string;
    artist: string;
    albumArt?: string;
  };
  isPlaying?: boolean;
  progress?: number;
  volume?: number;
  shuffle?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgressChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  volume = 80,
  shuffle = false,
  repeatMode = 'off',
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onVolumeChange,
  onShuffleToggle,
  onRepeatToggle,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        px: 2,
        py: 1,
      }}
    >
      {/* Progress Bar */}
      <Box sx={{ mb: 1 }}>
        <Slider
          value={progress}
          onChange={(_, value) => onProgressChange?.(value as number)}
          size="small"
          sx={{
            color: 'primary.main',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              opacity: 0,
              transition: 'opacity 0.2s',
            },
            '&:hover .MuiSlider-thumb': {
              opacity: 1,
            },
          }}
        />
      </Box>

      <Grid container alignItems="center" spacing={2}>
        {/* Track Info */}
        <Grid item xs={12} sm={3} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              variant="rounded"
              src={currentTrack?.albumArt}
              sx={{ width: 56, height: 56 }}
            >
              <QueueMusicIcon />
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
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
        </Grid>

        {/* Controls */}
        <Grid item xs={12} sm={6} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {/* Main Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Aleatorio">
                <IconButton
                  onClick={onShuffleToggle}
                  sx={{
                    color: shuffle ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <ShuffleIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Anterior">
                <IconButton onClick={onPrevious} color="inherit">
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
                    transform: 'scale(1.05)',
                  },
                  width: 40,
                  height: 40,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <Tooltip title="Siguiente">
                <IconButton onClick={onNext} color="inherit">
                  <SkipNextIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={repeatMode === 'one' ? 'Repetir una' : 'Repetir'}>
                <IconButton
                  onClick={onRepeatToggle}
                  sx={{
                    color:
                      repeatMode === 'off'
                        ? 'text.secondary'
                        : 'primary.main',
                  }}
                >
                  {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Time Display */}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatTime(progress)} / {formatTime((progress / 100) * 240)}
            </Typography>
          </Box>
        </Grid>

        {/* Volume Controls */}
        <Grid item xs={12} sm={3} md={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Tooltip title="Cola de reproducción">
              <IconButton color="inherit">
                <QueueMusicIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Dispositivos">
              <IconButton color="inherit">
                <DevicesIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 100 }}>
              <IconButton
                onClick={() => onVolumeChange?.(volume > 0 ? 0 : 80)}
                size="small"
                color="inherit"
              >
                {volume === 0 ? (
                  <VolumeOffIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )}
              </IconButton>
              <Slider
                value={volume}
                onChange={(_, value) => onVolumeChange?.(value as number)}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PlayerBar;
