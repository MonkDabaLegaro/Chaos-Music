import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

interface CreatePlaylistDialogProps {
  open?: boolean;
  onClose?: () => void;
  onCreate?: (name: string, description: string) => void;
}

const CreatePlaylistDialog: React.FC<CreatePlaylistDialogProps> = ({
  open = false,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate?.(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose?.();
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { bgcolor: 'background.paper' }
      }}
    >
      <DialogTitle>Crear nueva playlist</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Cover Art */}
          <Box
            sx={{
              width: 160,
              height: 160,
              bgcolor: 'background.elevated',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.highlight',
              },
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
              Subir portada
            </Typography>
          </Box>

          {/* Playlist Name */}
          <TextField
            fullWidth
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mi playlist"
            autoFocus
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade una descripción"
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!name.trim()}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePlaylistDialog;
