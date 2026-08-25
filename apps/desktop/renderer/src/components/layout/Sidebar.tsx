import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SearchIcon from '@mui/icons-material/Search';
import { chaosForestTokens as tokens } from '@chaos-music/design-system';
import {
  Box,
  Divider,
  IconButton,
  List,
  Tooltip,
  Typography,
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

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        height: '100%',
        bgcolor: tokens.color.background.surface,
        borderRight: `1px solid ${tokens.color.border.default}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ px: 2, py: 2.25, display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          aria-hidden
          sx={{
            width: 34,
            height: 34,
            borderRadius: `${tokens.radius.md}px`,
            border: `1px solid ${tokens.color.forest[400]}`,
            bgcolor: tokens.color.forest[900],
            display: 'grid',
            placeItems: 'center',
            fontFamily: tokens.typography.mono,
            color: tokens.color.accent.signal,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.05em',
          }}
        >
          CM
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Chaos Music
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 0.35,
              fontFamily: tokens.typography.mono,
              color: tokens.color.text.muted,
              fontSize: '0.62rem',
              letterSpacing: '0.11em',
            }}
          >
            LOCAL / READY
          </Typography>
        </Box>
        <Tooltip title="Contraer">
          <IconButton onClick={onToggle} size="small" sx={{ ml: 'auto' }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.25 }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </List>

      <Box sx={{ mt: 'auto', px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography
          sx={{
            fontFamily: tokens.typography.mono,
            color: tokens.color.text.muted,
            fontSize: '0.64rem',
            lineHeight: 1.8,
            letterSpacing: '0.06em',
          }}
        >
          ENGINE / DESKTOP<br />
          SOURCE / LOCAL<br />
          ANDROID / FOUNDATION
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
