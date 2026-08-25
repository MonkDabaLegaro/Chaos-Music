import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import React from 'react';

interface IconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'white';
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  color = 'inherit',
  size = 'medium',
  active = false,
  sx,
  children,
  ...props
}) => {
  const getColor = () => {
    if (color === 'white') {
      return active ? 'primary.main' : 'text.primary';
    }
    return color;
  };

  const customSx = {
    color: getColor(),
    transition: 'all 0.2s ease-in-out',
    ...(size === 'small' && {
      width: 32,
      height: 32,
      '& .MuiSvgIcon-root': {
        fontSize: 20,
      },
    }),
    ...(size === 'large' && {
      width: 56,
      height: 56,
      '& .MuiSvgIcon-root': {
        fontSize: 32,
      },
    }),
    ...(active && {
      color: 'primary.main',
    }),
    ...sx,
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.1)',
      ...(sx as object)?.['&:hover'],
    },
  };

  return (
    <MuiIconButton
      size={size}
      sx={customSx}
      {...props}
    >
      {children}
    </MuiIconButton>
  );
};

export default IconButton;
