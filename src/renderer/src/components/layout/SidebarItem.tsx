import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  selected?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  selected = false,
  onClick,
}) => {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderRadius: '4px',
        mb: 0.5,
        '&.Mui-selected': {
          bgcolor: 'rgba(29, 185, 84, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(29, 185, 84, 0.2)',
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.main',
          },
          '& .MuiListItemText-primary': {
            color: 'primary.main',
            fontWeight: 600,
          },
        },
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          noWrap: true,
          sx: {
            color: 'inherit',
            fontSize: '0.875rem',
          },
        }}
      />
    </ListItemButton>
  );
};

export default SidebarItem;
