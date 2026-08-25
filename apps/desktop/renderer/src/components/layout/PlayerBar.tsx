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
import { chaosForestTokens as tokens } from '@chaos-music/design-system';
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

interface PlayerBarProps {
  currentTrack?: {
    title: string;
    artist: string;
    albumArt?: string;
  };
  isPlaying?: boolean;
  position?: number;
  duration?: number;
  volume?: number;
  shuffle?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onPositionChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
}

const formatTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  isPlaying = false,
  position = 0,
  duration = 0,
  volume = 1,
  shuffle = false,
  repeatMode = 'off',
  onPlayPause,
  onNext,
  onPrevious,
  onPositionChange,
  onVolumeChange,
  onShuffleToggle,
  onRepeatToggle,
}) => {
  const hasTrack = Boolean(currentTrack);
  const progressMax = duration > 0 ? duration : Math.max(position, 1);

  return (
    <Paper
      component="section"
      square
      elevation={0}
      aria-label="Reproductor"
      sx={{
        position: 'relative',
        bgcolor: tokens.color.background.surface,
        borderTop: `1px solid ${tokens.color.border.default}`,
        px: 2,
        py: 1.25,
      }}
    >
      <Slider
        aria-label="Posición de reproducción"
        value={Math.min(position, progressMax)}
        min={0}
        max={progressMax}
        disabled={!hasTrack}
        onChange={(_, value) => onPositionChange?.(value as number)}
        size="small"
        sx={{
          position: 'absolute',
          top: -7,
          left: 0,
          right: 0,
          width: '100%',
          p: 0,
          height: 3,
          '& .MuiSlider-thumb': {
            width: 10,
            height: 10,
            opacity: 0,
            transition: `opacity ${tokens.motion.fast} ease`,
          },
          '&:hover .MuiSlider-thumb, &.Mui-focusVisible .MuiSlider-thumb': {
            opacity: 1,
          },
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) minmax(340px, 1.25fr) minmax(220px, 1fr)',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Avatar
            variant="rounded"
            src={currentTrack?.albumArt}
            sx={{
              width: 52,
              height: 52,
              bgcolor: tokens.color.background.elevated,
              border: `1px solid ${tokens.color.border.default}`,
            }}
          >
            <QueueMusicIcon />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 650, color: 'text.primary' }}
            >
              {currentTrack?.title || 'Nada reproduciéndose'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ display: 'block', color: 'text.secondary' }}>
              {currentTrack?.artist || 'Selecciona una pista de tu biblioteca'}
            </Typography>
            <Typography
              component="div"
              sx={{
                mt: 0.35,
                fontFamily: tokens.typography.mono,
                color: hasTrack ? tokens.color.accent.moss : tokens.color.text.muted,
                fontSize: '0.61rem',
                letterSpacing: '0.08em',
              }}
            >
              ENGINE / {isPlaying ? 'PLAYING' : hasTrack ? 'READY' : 'IDLE'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Aleatorio">
              <span>
                <IconButton
                  disabled={!hasTrack}
                  onClick={onShuffleToggle}
                  sx={{ color: shuffle ? tokens.color.accent.signal : 'text.secondary' }}
                >
                  <ShuffleIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Anterior">
              <span><IconButton disabled={!hasTrack} onClick={onPrevious}><SkipPreviousIcon /></IconButton></span>
            </Tooltip>

            <IconButton
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              disabled={!hasTrack}
              onClick={onPlayPause}
              sx={{
                width: 42,
                height: 42,
                mx: 0.4,
                bgcolor: hasTrack ? tokens.color.forest[500] : tokens.color.background.elevated,
                color: tokens.color.text.primary,
                border: `1px solid ${hasTrack ? tokens.color.forest[400] : tokens.color.border.default}`,
                '&:hover': {
                  bgcolor: tokens.color.forest[400],
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <Tooltip title="Siguiente">
              <span><IconButton disabled={!hasTrack} onClick={onNext}><SkipNextIcon /></IconButton></span>
            </Tooltip>

            <Tooltip title={repeatMode === 'one' ? 'Repetir una' : 'Repetición'}>
              <span>
                <IconButton
                  disabled={!hasTrack}
                  onClick={onRepeatToggle}
                  sx={{ color: repeatMode === 'off' ? 'text.secondary' : tokens.color.accent.signal }}
                >
                  {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Typography
            sx={{
              fontFamily: tokens.typography.mono,
              color: tokens.color.text.muted,
              fontSize: '0.64rem',
              letterSpacing: '0.04em',
            }}
          >
            {formatTime(position)} / {duration > 0 ? formatTime(duration) : '--:--'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Cola">
            <IconButton disabled={!hasTrack}><QueueMusicIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Salida de audio">
            <IconButton><DevicesIcon fontSize="small" /></IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 120 }}>
            <IconButton
              aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
              onClick={() => onVolumeChange?.(volume > 0 ? 0 : 0.8)}
              size="small"
            >
              {volume === 0 ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
            <Slider
              aria-label="Volumen"
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(_, value) => onVolumeChange?.(value as number)}
              size="small"
              sx={{ width: 80 }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PlayerBar;
