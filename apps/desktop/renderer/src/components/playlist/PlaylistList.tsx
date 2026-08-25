import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Avatar, Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';
import PlaylistCard, { PlaylistCardProps } from './PlaylistCard';

interface PlaylistListProps {
  playlists?: PlaylistCardProps[];
  view?: 'list' | 'grid';
  onPlaylistClick?: (playlistId: string) => void;
  onPlaylistPlay?: (playlistId: string) => void;
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
        {/* Create New Playlist Card */}
        <CardPlaceholder onClick={onCreatePlaylist} icon={<AddIcon />} label="Crear Playlist" />
        
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            {...playlist}
            onClick={() => onPlaylistClick?.(playlist.id)}
            onPlay={() => onPlaylistPlay?.(playlist.id)}
          />
        ))}
      </Box>
    );
  }

  return (
    <List>
      {/* Create New Playlist */}
      <ListItem disablePadding>
        <ListItemButton onClick={onCreatePlaylist}>
          <ListItemIcon>
            <Avatar sx={{ bgcolor: 'background.elevated', width: 40, height: 40 }}>
              <AddIcon />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary="Crear Playlist"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </ListItem>

      {playlists.map((playlist) => (
        <ListItem key={playlist.id} disablePadding>
          <ListItemButton onClick={() => onPlaylistClick?.(playlist.id)}>
            <ListItemIcon>
              <Avatar
                variant="rounded"
                src={playlist.coverArt}
                sx={{ width: 40, height: 40 }}
              >
                <PlaylistPlayIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={playlist.name}
              secondary={playlist.trackCount ? `${playlist.trackCount} canciones` : undefined}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

// Placeholder card component for "Create New" button
interface CardPlaceholderProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
}

const CardPlaceholder: React.FC<CardPlaceholderProps> = ({ onClick, icon, label }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        aspectRatio: '1',
        bgcolor: 'background.elevated',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'background.highlight',
        },
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default PlaylistList;
