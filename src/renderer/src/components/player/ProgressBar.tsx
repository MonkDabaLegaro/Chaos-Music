import { Box, Slider, Typography } from '@mui/material';
import React from 'react';

interface ProgressBarProps {
  value?: number;
  duration?: number;
  buffered?: number;
  onChange?: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  duration = 0,
  buffered = 0,
  onChange,
  onChangeCommitted,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (value / 100) * duration;

  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange?.(newValue as number)}
        onChangeCommitted={(_, newValue) => onChangeCommitted?.(newValue as number)}
        sx={{
          color: 'primary.main',
          height: 4,
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
          },
          '& .MuiSlider-rail': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover, &.Mui-focusVisible': {
              opacity: 1,
              boxShadow: '0 0 0 8px rgba(29, 185, 84, 0.16)',
            },
          },
          '&:hover .MuiSlider-thumb': {
            opacity: 1,
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
