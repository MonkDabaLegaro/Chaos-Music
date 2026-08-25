import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const globalStyles = (
  <MuiGlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      'html, body': {
        height: '100%',
        overflow: 'hidden',
      },
      '#root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(255, 255, 255, 0.3)',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      button: {
        border: 'none',
        outline: 'none',
        background: 'none',
        cursor: 'pointer',
      },
      input: {
        outline: 'none',
      },
      '.spotify-green': {
        color: '#1DB954',
      },
      '.hover-scale': {
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
      '.hover-lift': {
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      },
      '.text-gradient': {
        background: 'linear-gradient(45deg, #1DB954, #1ed760)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        backgroundClip: 'text',
      },
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.5,
        },
      },
      '@keyframes slideUp': {
        '0%': {
          opacity: 0,
          transform: 'translateY(20px)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
        },
        '100%': {
          opacity: 1,
        },
      },
      '.animate-pulse': {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      '.animate-slide-up': {
        animation: 'slideUp 0.3s ease-out',
      },
      '.animate-fade-in': {
        animation: 'fadeIn 0.3s ease-out',
      },
    }}
  />
);

export default globalStyles;
