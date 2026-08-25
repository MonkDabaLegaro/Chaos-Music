import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import React from 'react';

export interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration?: number;
  isPlaying?: boolean;
}

interface QueueListProps {
  tracks?: QueueTrack[];
  currentTrackId?: string;
  onTrackClick?: (trackId: string) => void;
  onRemoveTrack?: (trackId: string) => void;
  onClearQueue?: () => void;
}

const QueueList: React.FC<QueueListProps> = ({
  tracks = [],
  currentTrackId,
  onTrackClick,
  onRemoveTrack,
  onClearQueue,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Cola de reproducción</Typography>
        {tracks.length > 0 && (
          <IconButton size="small" onClick={onClearQueue} title="Limpiar cola">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {tracks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <MusicNoteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No hay canciones en la cola
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Añade canciones para comenzar a reproducir
          </Typography>
        </Box>
      ) : (
        <List sx={{ py: 0 }}>
          {tracks.map((track, index) => (
            <React.Fragment key={track.id}>
              <ListItem
                disablePadding
                sx={{
                  bgcolor:
                    track.id === currentTrackId
                      ? 'rgba(29, 185, 84, 0.1)'
                      : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemButton onClick={() => onTrackClick?.(track.id)}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {track.id === currentTrackId ? (
                      <PlayArrowIcon color="primary" fontSize="small" />
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', width: 20 }}
                      >
                        {index + 1}
                      </Typography>
                    )}
                  </ListItemIcon>

                  <Avatar
                    variant="rounded"
                    src={track.albumArt}
                    sx={{ width: 40, height: 40, mr: 1.5 }}
                  >
                    <MusicNoteIcon fontSize="small" />
                  </Avatar>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            track.id === currentTrackId ? 600 : 400,
                          color:
                            track.id === currentTrackId
                              ? 'primary.main'
                              : 'text.primary',
                        }}
                      >
                        {track.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {track.artist}
                      </Typography>
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', minWidth: 40, textAlign: 'right' }}
                    >
                      {formatDuration(track.duration)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTrack?.(track.id);
                      }}
                      sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemButton>
              </ListItem>
              {index < tracks.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default QueueList;
