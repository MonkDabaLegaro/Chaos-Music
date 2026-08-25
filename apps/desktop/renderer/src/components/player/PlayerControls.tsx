import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';

interface PlayerControlsProps {
  isPlaying?: boolean;
  shuffle?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onSkipNext?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying = false,
  shuffle = false,
  repeatMode = 'off',
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  onSkipNext,
}) => {
  const handleNext = onNext ?? onSkipNext;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Aleatorio">
          <IconButton onClick={onShuffleToggle} size="small" sx={{ color: shuffle ? 'primary.main' : 'text.secondary' }}>
            <ShuffleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Anterior">
          <IconButton onClick={onPrevious} color="inherit"><SkipPreviousIcon /></IconButton>
        </Tooltip>

        <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
          <IconButton
            onClick={onPlayPause}
            sx={{
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': { bgcolor: 'grey.300', transform: 'scale(1.05)' },
              width: 40,
              height: 40,
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Siguiente">
          <IconButton onClick={handleNext} color="inherit"><SkipNextIcon /></IconButton>
        </Tooltip>

        <Tooltip title={repeatMode === 'one' ? 'Repetir una' : 'Repetir'}>
          <IconButton onClick={onRepeatToggle} size="small" sx={{ color: repeatMode === 'off' ? 'text.secondary' : 'primary.main' }}>
            {repeatMode === 'one' ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PlayerControls;
