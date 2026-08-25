import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    DialogContent,
    DialogTitle,
    IconButton,
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
    Typography
} from '@mui/material';
import React from 'react';

interface DialogProps extends Omit<MuiDialogProps, 'onClose'> {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  subtitle,
  onClose,
  showCloseButton = true,
  children,
  PaperProps,
  ...props
}) => {
  return (
    <MuiDialog
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          minWidth: 400,
          maxWidth: 500,
        },
        ...PaperProps,
      }}
      {...props}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
    </MuiDialog>
  );
};

export default Dialog;
