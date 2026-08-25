/**
 * Tipos para el servicio de escáner de archivos
 */

export interface ScanResult {
  totalFiles: number;
  scannedFiles: number;
  addedTracks: number;
  updatedTracks: number;
  removedTracks: number;
  errors: ScanError[];
  duration: number;
}

export interface ScanError {
  file: string;
  error: string;
}

export interface ScanProgress {
  current: number;
  total: number;
  currentFile: string;
  percentage: number;
}

export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  currentPath: string;
  currentFile: string;
  startTime: number | null;
  result: ScanResult | null;
}

export interface ScanOptions {
  libraryId: string;
  paths: string[];
  fileTypes?: string[];
  forceRescan?: boolean;
}

export interface FileInfo {
  path: string;
  mtime: Date;
  size: number;
  extension: string;
}

export interface TrackMetadata {
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  duration: number;
  bitrate?: number;
  sampleRate?: number;
  format?: string;
  size?: number;
  lyrics?: string;
  coverData?: Uint8Array;
  coverMimeType?: string;
}

export interface ProcessedTrack {
  id: string;
  title: string;
  artist_id?: string;
  album_id?: string;
  file_path: string;
  duration: number;
  track_number?: number;
  disc_number?: number;
  file_size: number;
  bitrate?: number;
  sample_rate?: number;
  format?: string;
  genre?: string;
  year?: number;
  file_hash: string;
}

export interface ScanEventData {
  type: 'progress' | 'complete' | 'error' | 'started';
  data: ScanProgress | ScanResult | ScanError | null;
}
