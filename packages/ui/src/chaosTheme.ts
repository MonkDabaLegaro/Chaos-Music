import { createTheme } from '@mui/material/styles';
import { chaosForestTokens as tokens } from '@chaos-music/design-system';

export const chaosTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.color.accent.signal,
      dark: tokens.color.forest[500],
      light: tokens.color.accent.moss,
      contrastText: tokens.color.background.deep,
    },
    secondary: {
      main: tokens.color.accent.moss,
      contrastText: tokens.color.background.deep,
    },
    background: {
      default: tokens.color.background.deep,
      paper: tokens.color.background.surface,
    },
    text: {
      primary: tokens.color.text.primary,
      secondary: tokens.color.text.secondary,
      disabled: tokens.color.text.muted,
    },
    divider: tokens.color.border.default,
    error: { main: tokens.color.state.error },
    warning: { main: tokens.color.state.warning },
    info: { main: tokens.color.state.info },
    success: { main: tokens.color.forest[400] },
  },
  typography: {
    fontFamily: tokens.typography.sans,
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 650, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  shape: { borderRadius: tokens.radius.md },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          transition: `background-color ${tokens.motion.fast} ease, border-color ${tokens.motion.fast} ease, transform ${tokens.motion.fast} ease`,
        },
        containedPrimary: {
          backgroundColor: tokens.color.forest[500],
          color: tokens.color.text.primary,
          '&:hover': { backgroundColor: tokens.color.forest[400] },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.color.background.surface,
          border: `1px solid ${tokens.color.border.default}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: tokens.color.accent.signal },
        rail: { backgroundColor: tokens.color.forest[900] },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.color.background.elevated,
          color: tokens.color.text.primary,
          border: `1px solid ${tokens.color.border.default}`,
          fontFamily: tokens.typography.mono,
          fontSize: '0.72rem',
        },
      },
    },
  },
});
