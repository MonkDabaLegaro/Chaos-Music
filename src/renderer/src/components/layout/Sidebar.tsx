import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Divider,
    IconButton,
    List,
    Tooltip,
    Typography
} from '@mui/material';
import React from 'react';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const menuItems = [
    { icon: <HomeIcon />, label: 'Inicio', path: '/' },
    { icon: <SearchIcon />, label: 'Buscar', path: '/search' },
    { icon: <ExploreIcon />, label: 'Explorar', path: '/explore' },
    { icon: <LibraryMusicIcon />, label: 'Biblioteca', path: '/library' },
  ];

  const playlists = [
    { icon: <PlaylistPlayIcon />, label: 'Mis Mejores Canciones', path: '/playlist/1' },
    { icon: <PlaylistPlayIcon />, label: 'Rock Clásico', path: '/playlist/2' },
    { icon: <PlaylistPlayIcon />, label: 'Jazz & Blues', path: '/playlist/3' },
    { icon: <PlaylistPlayIcon />, label: 'Música Electrónica', path: '/playlist/4' },
  ];

  return (
    <Box
      sx={{
        width: '240px',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease-in-out',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 700 }}>
            M
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          MusicPlayer
        </Typography>
        <Tooltip title="Contraer">
          <IconButton onClick={onToggle} size="small" sx={{ ml: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Main Navigation */}
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Playlists */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Playlists
          </Typography>
          <Tooltip title="Crear Playlist">
            <IconButton size="small">
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <List dense>
          {playlists.map((playlist) => (
            <SidebarItem key={playlist.path} {...playlist} />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
