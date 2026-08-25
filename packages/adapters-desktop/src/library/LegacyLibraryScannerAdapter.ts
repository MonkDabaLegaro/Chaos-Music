import type { LibraryScanner, ScanResult, ScanStatus } from '@chaos-music/contracts';

export interface LegacyScanner {
  scanLibrary(libraryId: string): Promise<ScanResult>;
  getScanStatus(): ScanStatus;
  cancelScan(): void;
}

export class LegacyLibraryScannerAdapter implements LibraryScanner {
  constructor(private readonly scanner: LegacyScanner) {}
  scan(libraryId: string) { return this.scanner.scanLibrary(libraryId); }
  getStatus() { return this.scanner.getScanStatus(); }
  cancel() { this.scanner.cancelScan(); }
}
