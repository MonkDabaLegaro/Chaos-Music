export type AppErrorCode =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'SOURCE_UNAVAILABLE'
  | 'FILESYSTEM_PERMISSION'
  | 'UNSUPPORTED_MEDIA'
  | 'PERSISTENCE_FAILURE'
  | 'PLAYBACK_FAILURE'
  | 'EXTERNAL_PROVIDER_FAILURE'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }

  static fromUnknown(error: unknown, fallbackCode: AppErrorCode = 'UNKNOWN'): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error) return new AppError(fallbackCode, error.message, error);
    return new AppError(fallbackCode, typeof error === 'string' ? error : 'Unknown application error', error);
  }
}
