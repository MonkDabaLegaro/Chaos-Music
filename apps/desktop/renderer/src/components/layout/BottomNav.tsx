import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import React from 'react';

interface BottomNavProps {
  value?: number;
  onChange?: (event: React.SyntheticEvent, newValue: number) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ value = 0, onChange }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={onChange}
        sx={{
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          '& .MuiBottomNavigationAction-root': {
            py: 1,
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Inicio"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Buscar"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label="Biblioteca"
          icon={<LibraryMusicIcon />}
        />
        <BottomNavigationAction
          label="Cola"
          icon={
            <Badge badgeContent={3} color="error">
              <QueueMusicIcon />
            </Badge>
          }
        />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
