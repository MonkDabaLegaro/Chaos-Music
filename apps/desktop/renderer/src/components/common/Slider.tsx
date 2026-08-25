import { Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material';
import React from 'react';

interface SliderProps extends Omit<MuiSliderProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium';
}

const Slider: React.FC<SliderProps> = ({
  color = 'primary',
  size = 'medium',
  sx,
  ...props
}) => {
  const customSx = {
    color: `${color}.main`,
    height: size === 'small' ? 2 : 4,
    '& .MuiSlider-thumb': {
      width: size === 'small' ? 8 : 12,
      height: size === 'small' ? 8 : 12,
      transition: 'all 0.2s ease-in-out',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: `0 0 0 8px rgba(29, 185, 84, 0.16)`,
      },
    },
    '& .MuiSlider-track': {
      transition: 'all 0.2s ease-in-out',
    },
    '& .MuiSlider-rail': {
      opacity: 0.3,
      backgroundColor: 'currentColor',
    },
    ...sx,
  };

  return (
    <MuiSlider
      size={size}
      sx={customSx}
      {...props}
    />
  );
};

export default Slider;
