import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';
import React from 'react';

interface LoadingSpinnerProps extends Omit<CircularProgressProps, 'variant'> {
  size?: number | string;
  thickness?: number;
  label?: string;
  showLabel?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  thickness = 4,
  label,
  showLabel = false,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{
          color: 'primary.main',
        }}
        {...props}
      />
      {showLabel && label && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
