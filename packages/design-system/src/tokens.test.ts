import { chaosForestTokens } from './tokens';

describe('Chaos Forest tokens', () => {
  it('exports the approved identity colors', () => {
    expect(chaosForestTokens.color.background.deep).toBe('#070B09');
    expect(chaosForestTokens.color.accent.signal).toBe('#63E69A');
    expect(chaosForestTokens.color.border.default).toBe('#1D2B23');
  });

  it('does not contain the old Spotify green', () => {
    expect(JSON.stringify(chaosForestTokens).toUpperCase()).not.toContain('#1DB954');
  });
});
