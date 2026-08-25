import { LegacyLibraryScannerAdapter, LegacyMusicRepositoryAdapter } from '@chaos-music/adapters-desktop';
import { LibraryService } from '@chaos-music/core';
import { databaseService } from '../services/database/database.service';
import { fileScannerService } from '../services/fileScanner/scanner.service';

const repository = new LegacyMusicRepositoryAdapter(databaseService);
const scanner = new LegacyLibraryScannerAdapter(fileScannerService);
repository.initialize();

export const desktopApplication = {
  library: new LibraryService(repository, scanner),
  legacyDatabase: databaseService,
};
