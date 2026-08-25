import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, IconButton, Slider, Tooltip } from '@mui/material';
import React from 'react';

interface VolumeControlProps {
  value?: number;
  muted?: boolean;
  onChange?: (value: number) => void;
  onMuteToggle?: () => void;
  orientation?: 'horizontal' | 'vertical';
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  value = 80,
  muted = false,
  onChange,
  onMuteToggle,
  orientation = 'horizontal',
}) => {
  const displayValue = muted ? 0 : value;

  const getVolumeIcon = () => {
    if (muted || value === 0) {
      return <VolumeOffIcon />;
    }
    if (value < 50) {
      return <VolumeMuteIcon />;
    }
    return <VolumeUpIcon />;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
      }}
    >
      <Tooltip title={muted ? 'Activar sonido' : 'Silenciar'}>
        <IconButton onClick={onMuteToggle} size="small" color="inherit">
          {getVolumeIcon()}
        </IconButton>
      </Tooltip>

      <Slider
        value={displayValue}
        onChange={(_, newValue) => onChange?.(newValue as number)}
        size="small"
        sx={{
          width: orientation === 'vertical' ? 4 : 100,
          height: orientation === 'vertical' ? 100 : 4,
          color: 'primary.main',
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover, &.Mui-focusVisible': {
              opacity: 1,
            },
          },
          '&:hover .MuiSlider-thumb': {
            opacity: 1,
          },
          ...(orientation === 'vertical' && {
            '& .MuiSlider-rail': {
              width: 4,
            },
            '& .MuiSlider-track': {
              width: 4,
            },
            '& .MuiSlider-thumb': {
              marginLeft: -4,
            },
          }),
        }}
        orientation={orientation}
      />
    </Box>
  );
};

export default VolumeControl;
