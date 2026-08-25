import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
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
  const resolvedColor = color === 'white'
    ? (active ? 'primary.main' : 'text.primary')
    : color;

  const baseSx: SxProps<Theme> = {
    color: active ? 'primary.main' : resolvedColor,
    transition: 'all 0.2s ease-in-out',
    ...(size === 'small' && {
      width: 32,
      height: 32,
      '& .MuiSvgIcon-root': { fontSize: 20 },
    }),
    ...(size === 'large' && {
      width: 56,
      height: 56,
      '& .MuiSvgIcon-root': { fontSize: 32 },
    }),
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  return (
    <MuiIconButton
      size={size}
      sx={[baseSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    >
      {children}
    </MuiIconButton>
  );
};

export default IconButton;
