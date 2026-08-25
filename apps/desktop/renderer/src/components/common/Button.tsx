import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import React from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'green';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  children,
  sx,
  ...props
}) => {
  const customSx = {
    ...(variant === 'green' && {
      bgcolor: 'primary.main',
      color: 'black',
      '&:hover': {
        bgcolor: 'primary.light',
        transform: 'scale(1.02)',
      },
    }),
    ...(size === 'small' && {
      py: 0.5,
      px: 2,
      fontSize: '0.8125rem',
    }),
    ...(size === 'large' && {
      py: 1.5,
      px: 4,
      fontSize: '1rem',
    }),
    transition: 'all 0.2s ease-in-out',
    ...sx,
  };

  return (
    <MuiButton
      variant={variant === 'green' ? 'contained' : variant}
      size={size}
      sx={customSx}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
