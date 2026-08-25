import { chaosForestTokens as tokens } from '@chaos-music/design-system';

export const chaosGlobalStyles = {
  '*': {
    boxSizing: 'border-box' as const,
  },
  'html, body, #root': {
    margin: 0,
    minHeight: '100%',
    height: '100%',
  },
  body: {
    overflow: 'hidden',
    backgroundColor: tokens.color.background.deep,
    color: tokens.color.text.primary,
    fontFamily: tokens.typography.sans,
  },
  '#root': {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  '::selection': {
    backgroundColor: tokens.color.forest[700],
    color: tokens.color.text.primary,
  },
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '::-webkit-scrollbar-track': {
    backgroundColor: tokens.color.background.deep,
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: tokens.color.forest[900],
    borderRadius: `${tokens.radius.round}px`,
    border: `2px solid ${tokens.color.background.deep}`,
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: tokens.color.forest[700],
  },
  a: { color: 'inherit', textDecoration: 'none' },
  '.technical-meta': {
    fontFamily: tokens.typography.mono,
    color: tokens.color.text.secondary,
    letterSpacing: '0.04em',
    fontSize: '0.75rem',
  },
  '.signal-accent': { color: tokens.color.accent.signal },
  '.text-gradient': {
    background: `linear-gradient(90deg, ${tokens.color.accent.moss}, ${tokens.color.accent.signal})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};

export default chaosGlobalStyles;
