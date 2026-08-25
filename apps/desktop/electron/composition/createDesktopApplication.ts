import { LegacyLibraryScannerAdapter, LegacyMusicRepositoryAdapter, LegacyYouTubeMusicSource } from '@chaos-music/adapters-desktop';
import { LibraryService, SourceRegistry } from '@chaos-music/core';
import { databaseService } from '../services/database/database.service';
import { fileScannerService } from '../services/fileScanner/scanner.service';
import { youtubeService } from '../services/youtube/youtube.service';

const repository = new LegacyMusicRepositoryAdapter(databaseService);
const scanner = new LegacyLibraryScannerAdapter(fileScannerService);
const youtubeSource = new LegacyYouTubeMusicSource(youtubeService);
const sourceRegistry = new SourceRegistry();

repository.initialize();
sourceRegistry.register(youtubeSource);

export const desktopApplication = {
  library: new LibraryService(repository, scanner),
  sources: sourceRegistry,
  legacyDatabase: databaseService,
  legacyYouTube: youtubeService,
};
