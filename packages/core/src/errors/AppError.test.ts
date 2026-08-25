import { AppError } from './AppError';

describe('AppError', () => {
  it('normalizes Error values with the requested fallback code', () => {
    const normalized = AppError.fromUnknown(new Error('boom'), 'PERSISTENCE_FAILURE');
    expect(normalized.code).toBe('PERSISTENCE_FAILURE');
    expect(normalized.message).toBe('boom');
  });

  it('uses UNKNOWN for non-Error values by default', () => {
    expect(AppError.fromUnknown('boom').code).toBe('UNKNOWN');
  });

  it('preserves an existing AppError', () => {
    const error = new AppError('NOT_FOUND', 'Track missing');
    expect(AppError.fromUnknown(error)).toBe(error);
  });
});
