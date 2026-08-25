import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
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
  const {
    playerState,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    setRepeat,
    toggleShuffle,
  } = usePlayer();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const cycleRepeat = () => {
    const nextMode = playerState.repeatMode === 'off'
      ? 'all'
      : playerState.repeatMode === 'all'
        ? 'one'
        : 'off';
    void setRepeat(nextMode);
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
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {!isMobile && sidebarOpen && (
          <Sidebar onToggle={() => setSidebarOpen(false)} />
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: 'auto',
              px: { xs: 2, lg: 3 },
              py: 2,
              pb: isMobile ? 10 : 3,
            }}
          >
            {children}
          </Box>

          {!isMobile && (
            <PlayerBar
              currentTrack={playerState.currentTrack ? {
                title: playerState.currentTrack.title,
                artist: playerState.currentTrack.artist,
                albumArt: playerState.currentTrack.coverPath,
              } : undefined}
              isPlaying={playerState.isPlaying}
              position={playerState.position}
              volume={playerState.volume}
              shuffle={playerState.shuffle}
              repeatMode={playerState.repeatMode}
              onPlayPause={() => void togglePlayPause()}
              onNext={() => void next()}
              onPrevious={() => void previous()}
              onPositionChange={(value) => void seek(value)}
              onVolumeChange={(value) => void setVolume(value)}
              onShuffleToggle={() => void toggleShuffle()}
              onRepeatToggle={cycleRepeat}
            />
          )}
        </Box>
      </Box>

      {isMobile && <BottomNav />}
    </Box>
  );
};

export default MainLayout;
