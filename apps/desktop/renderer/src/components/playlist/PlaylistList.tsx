import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Avatar, Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import type { Playlist } from '@shared/types';
import React from 'react';

interface PlaylistListProps {
  playlists?: Playlist[];
  view?: 'list' | 'grid';
  onPlaylistClick?: (playlist: Playlist) => void;
  onPlaylistPlay?: (playlist: Playlist) => void;
  onCreatePlaylist?: () => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists = [],
  view = 'list',
  onPlaylistClick,
  onPlaylistPlay,
  onCreatePlaylist,
}) => {
  if (view === 'grid') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 3 }}>
        <CardPlaceholder onClick={onCreatePlaylist} icon={<AddIcon />} label="Crear playlist" />
        {playlists.map((playlist) => (
          <Box
            key={playlist.id}
            onClick={() => onPlaylistClick?.(playlist)}
            sx={{ p: 2, bgcolor: 'background.elevated', border: '1px solid', borderColor: 'divider', borderRadius: 2, cursor: 'pointer' }}
          >
            <Avatar variant="rounded" src={playlist.coverPath} sx={{ width: '100%', height: 'auto', aspectRatio: '1', mb: 1.5 }}>
              <PlaylistPlayIcon />
            </Avatar>
            <Typography sx={{ fontWeight: 600 }}>{playlist.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{playlist.trackCount} canciones</Typography>
            {onPlaylistPlay && <IconButton size="small" onClick={(event) => { event.stopPropagation(); onPlaylistPlay(playlist); }}><PlaylistPlayIcon /></IconButton>}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={onCreatePlaylist}>
          <ListItemIcon><Avatar sx={{ bgcolor: 'background.elevated', width: 40, height: 40 }}><AddIcon /></Avatar></ListItemIcon>
          <ListItemText primary="Crear playlist" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </ListItem>
      {playlists.map((playlist) => (
        <ListItem key={playlist.id} disablePadding secondaryAction={<IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>}>
          <ListItemButton onClick={() => onPlaylistClick?.(playlist)}>
            <ListItemIcon>
              <Avatar variant="rounded" src={playlist.coverPath} sx={{ width: 40, height: 40 }}><PlaylistPlayIcon /></Avatar>
            </ListItemIcon>
            <ListItemText
              primary={playlist.name}
              secondary={playlist.trackCount ? `${playlist.trackCount} canciones` : undefined}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

interface CardPlaceholderProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
}

const CardPlaceholder: React.FC<CardPlaceholderProps> = ({ onClick, icon, label }) => (
  <Box
    onClick={onClick}
    sx={{
      aspectRatio: '1',
      bgcolor: 'background.elevated',
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '&:hover': { borderColor: 'primary.dark' },
    }}
  >
    <Box sx={{ color: 'text.secondary', mb: 1 }}>{icon}</Box>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
  </Box>
);

export default PlaylistList;
