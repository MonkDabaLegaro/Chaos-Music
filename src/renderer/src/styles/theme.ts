import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
      light: '#1ed760',
      dark: '#1aa34a',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#e0e0e0',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#181818',
      elevated: '#242424',
      highlight: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#6a6a6a',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.2)',
    '0 2px 4px rgba(0, 0, 0, 0.2)',
    '0 4px 8px rgba(0, 0, 0, 0.2)',
    '0 6px 12px rgba(0, 0, 0, 0.2)',
    '0 8px 16px rgba(0, 0, 0, 0.2)',
    '0 10px 20px rgba(0, 0, 0, 0.2)',
    '0 12px 24px rgba(0, 0, 0, 0.2)',
    '0 14px 28px rgba(0, 0, 0, 0.2)',
    '0 16px 32px rgba(0, 0, 0, 0.2)',
    '0 18px 36px rgba(0, 0, 0, 0.2)',
    '0 20px 40px rgba(0, 0, 0, 0.2)',
    '0 22px 44px rgba(0, 0, 0, 0.2)',
    '0 24px 48px rgba(0, 0, 0, 0.2)',
    '0 26px 52px rgba(0, 0, 0, 0.2)',
    '0 28px 56px rgba(0, 0, 0, 0.2)',
    '0 30px 60px rgba(0, 0, 0, 0.2)',
    '0 32px 64px rgba(0, 0, 0, 0.2)',
    '0 34px 68px rgba(0, 0, 0, 0.2)',
    '0 36px 72px rgba(0, 0, 0, 0.2)',
    '0 38px 76px rgba(0, 0, 0, 0.2)',
    '0 40px 80px rgba(0, 0, 0, 0.2)',
    '0 42px 84px rgba(0, 0, 0, 0.2)',
    '0 44px 88px rgba(0, 0, 0, 0.2)',
    '0 46px 92px rgba(0, 0, 0, 0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          padding: 0,
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#121212',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#444',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '500px',
          padding: '8px 24px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          backgroundColor: '#1DB954',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#1ed760',
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderColor: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#ffffff',
          },
        },
        text: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#b3b3b3',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          borderRadius: '8px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#282828',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#1DB954',
          '&:hover': {
            color: '#1ed760',
          },
        },
        thumb: {
          backgroundColor: '#ffffff',
          '&:hover, &.Mui-focusVisible': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 8px rgba(29, 185, 84, 0.16)',
          },
        },
        track: {
          backgroundColor: '#1DB954',
        },
        rail: {
          backgroundColor: '#4d4d4d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#242424',
            borderRadius: '500px',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1DB954',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 185, 84, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(29, 185, 84, 0.2)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#b3b3b3',
          '&.Mui-selected': {
            color: '#1DB954',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#282828',
          borderRadius: '8px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: '4px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#b3b3b3',
          '&.Mui-selected': {
            color: '#1DB954',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#1DB954',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export default theme;
