export const chaosForestTokens = {
  color: {
    background: {
      deep: '#070B09',
      surface: '#0C1210',
      elevated: '#111A16',
    },
    forest: {
      900: '#102A1D',
      700: '#174D32',
      500: '#27734C',
      400: '#3C9466',
    },
    accent: {
      moss: '#7DB58B',
      signal: '#63E69A',
    },
    text: {
      primary: '#E5EEE8',
      secondary: '#95A69B',
      muted: '#56645C',
    },
    border: {
      default: '#1D2B23',
    },
    state: {
      error: '#E57A7A',
      warning: '#D7B56D',
      info: '#7AA6B8',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    round: 999,
  },
  typography: {
    sans: 'Inter, Geist, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Geist Mono", "SFMono-Regular", Consolas, monospace',
  },
  motion: {
    fast: '120ms',
    normal: '200ms',
  },
} as const;

export type ChaosForestTokens = typeof chaosForestTokens;
