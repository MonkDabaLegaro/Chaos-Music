import {
    Box,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Header from './Header';
import PlayerBar from './PlayerBar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {!isMobile && sidebarOpen && (
          <Sidebar onToggle={toggleSidebar} />
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ml: !isMobile && sidebarOpen ? '240px' : 0,
            transition: 'margin-left 0.3s ease-in-out',
          }}
        >
          <Header onMenuClick={toggleSidebar} />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              pb: isMobile ? 10 : 0,
            }}
          >
            {children}
          </Box>
          {!isMobile && <PlayerBar />}
        </Box>
      </Box>

      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNav />}
    </Box>
  );
};

export default MainLayout;
