import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert, AlertColor, Slide, Snackbar } from '@mui/material';
import React from 'react';

interface ToastProps {
  open?: boolean;
  message?: string;
  severity?: AlertColor;
  duration?: number;
  onClose?: () => void;
}

interface ToastRef {
  show: (message: string, severity?: AlertColor, duration?: number) => void;
  hide: () => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

// Simple Toast implementation
const Toast: React.FC<ToastProps> = ({
  open = false,
  message = '',
  severity = 'info',
  duration = 4000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: 300,
        }}
        iconMapping={{
          success: <CheckCircleIcon fontSize="inherit" />,
          error: <ErrorIcon fontSize="inherit" />,
          info: <InfoIcon fontSize="inherit" />,
          warning: <WarningIcon fontSize="inherit" />,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
export type { ToastProps, ToastRef };

