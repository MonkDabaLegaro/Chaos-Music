import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { Avatar, Box, Checkbox, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';

export interface TrackItemProps {
  id: string;
  index?: number;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration?: number;
  dateAdded?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  showAlbum?: boolean;
  showDateAdded?: boolean;
  showDuration?: boolean;
  onClick?: () => void;
  onPlay?: () => void;
  onMore?: () => void;
  onFavoriteToggle?: () => void;
  onAddToQueue?: () => void;
  onAddToPlaylist?: () => void;
  onDownload?: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  id,
  index,
  title,
  artist,
  album,
  albumArt,
  duration,
  dateAdded,
  isPlaying = false,
  isFavorite = false,
  showAlbum = true,
  showDateAdded = true,
  showDuration = true,
  onClick,
  onPlay,
  onMore,
  onFavoriteToggle,
  onAddToQueue,
  onAddToPlaylist,
  onDownload,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    onMore?.();
  };

  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <>
      <TableRow
        data-track-id={id}
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          bgcolor: isPlaying ? 'rgba(99, 230, 154, 0.08)' : 'transparent',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' },
          '&:hover .track-number': { display: 'none' },
          '&:hover .track-play': { display: 'flex' },
          '&:hover .track-more': { opacity: 1 },
        }}
      >
        <TableCell padding="checkbox">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox size="small" />
            <Box className="track-number" sx={{ display: 'flex', alignItems: 'center', width: 24 }}>
              <Typography variant="body2" sx={{ color: isPlaying ? 'primary.main' : 'text.secondary', fontWeight: isPlaying ? 600 : 400 }}>
                {index}
              </Typography>
            </Box>
            <Box className="track-play" sx={{ display: 'none', alignItems: 'center' }}>
              <IconButton size="small" onClick={(event) => { event.stopPropagation(); onPlay?.(); }} color="primary">
                {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar variant="rounded" src={albumArt} sx={{ width: 40, height: 40 }}>
              <QueueMusicIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: isPlaying ? 600 : 400, color: isPlaying ? 'primary.main' : 'text.primary' }}>
                {title}
              </Typography>
              {artist && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{artist}</Typography>}
            </Box>
          </Box>
        </TableCell>

        {showAlbum && <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{album || '-'}</Typography></TableCell>}
        {showDateAdded && <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{dateAdded || '-'}</Typography></TableCell>}
        {showDuration && (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={(event) => { event.stopPropagation(); onFavoriteToggle?.(); }}
                sx={{ color: isFavorite ? 'primary.main' : 'text.secondary', opacity: 0.65, '&:hover': { opacity: 1 } }}
              >
                {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 40 }}>{formatDuration(duration)}</Typography>
            </Box>
          </TableCell>
        )}

        <TableCell padding="checkbox">
          <IconButton className="track-more" size="small" onClick={handleMenuOpen} sx={{ opacity: 0.45 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: 'background.paper' } }}>
        <MenuItem onClick={() => { handleMenuClose(); onPlay?.(); }}>
          <ListItemIcon>{isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}</ListItemIcon>
          <ListItemText>{isPlaying ? 'Pausar' : 'Reproducir'}</ListItemText>
        </MenuItem>
        {onAddToQueue && (
          <MenuItem onClick={() => { handleMenuClose(); onAddToQueue(); }}>
            <ListItemIcon><QueueMusicIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Añadir a la cola</ListItemText>
          </MenuItem>
        )}
        {onAddToPlaylist && (
          <MenuItem onClick={() => { handleMenuClose(); onAddToPlaylist(); }}>
            <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Añadir a playlist</ListItemText>
          </MenuItem>
        )}
        {onDownload && (
          <MenuItem onClick={() => { handleMenuClose(); onDownload(); }}>
            <ListItemIcon><FileDownloadIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Descargar</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default TrackItem;
