/**
 * Handlers IPC para la gestión de biblioteca musical local
 */

import path from 'node:path';
import { databaseService } from '../services/database/database.service';
import type { TrackFilter } from '../services/database/types';
import { fileScannerService } from '../services/fileScanner/scanner.service';
import { registerHandler } from '../utils/ipc';

// Inicializar la base de datos al cargar el módulo
databaseService.initialize();

/**
 * Escanear biblioteca(s) de música
 */
registerHandler('library:scan', async (_event, libraryId: string) => {
  try {
    const result = await fileScannerService.scanLibrary(libraryId);
    return { success: true, result };
  } catch (error) {
    console.error('Error escaneando biblioteca:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
});

/**
 * Obtener estado del escaneo
 */
registerHandler('library:getScanStatus', async () => {
  return fileScannerService.getScanStatus();
});

/**
 * Cancelar escaneo en progreso
 */
registerHandler('library:cancelScan', async () => {
  fileScannerService.cancelScan();
  return { success: true };
});

/**
 * Obtener lista de canciones con filtros
 */
registerHandler('library:getTracks', async (_event, filter?: TrackFilter) => {
  try {
    const result = databaseService.getAllTracks(filter);
    return { success: true, ...result };
  } catch (error) {
    console.error('Error obteniendo canciones:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido',
      tracks: [],
      total: 0
    };
  }
});

/**
 * Obtener canción por ID
 */
registerHandler('library:getTrack', async (_event, trackId: string) => {
  try {
    const track = databaseService.getTrackById(trackId);
    return { success: true, track };
  } catch (error) {
    console.error('Error obteniendo canción:', error);
    return { success: false, track: null };
  }
});

/**
 * Obtener artistas
 */
registerHandler('library:getArtists', async () => {
  try {
    const artists = databaseService.getAllArtists();
    return { success: true, artists, total: artists.length };
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    return { success: false, artists: [], total: 0 };
  }
});

/**
 * Obtener álbum por ID
 */
registerHandler('library:getAlbum', async (_event, albumId: string) => {
  try {
    const album = databaseService.getAlbumById(albumId);
    return { success: true, album };
  } catch (error) {
    console.error('Error obteniendo álbum:', error);
    return { success: false, album: null };
  }
});

/**
 * Obtener albums
 */
registerHandler('library:getAlbums', async (_event, artistId?: string) => {
  try {
    const albums = artistId 
      ? databaseService.getAlbumsByArtist(artistId) 
      : databaseService.getAllAlbums();
    return { success: true, albums, total: albums.length };
  } catch (error) {
    console.error('Error obteniendo álbumes:', error);
    return { success: false, albums: [], total: 0 };
  }
});

/**
 * Obtener géneros
 */
registerHandler('library:getGenres', async () => {
  try {
    const genres = databaseService.getAllGenres();
    return { success: true, genres };
  } catch (error) {
    console.error('Error obteniendo géneros:', error);
    return { success: false, genres: [] };
  }
});

/**
 * Añadir carpeta a monitorizar
 */
registerHandler('library:addFolder', async (_event, folderPath: string, name?: string) => {
  try {
    const library = databaseService.addLibrary({
      name: name || folderPath.split(path.sep).pop() || 'Nueva Biblioteca',
      path: folderPath,
      scan_depth: -1,
      file_types: 'mp3,wav,flac,aac,ogg,m4a',
      is_active: 1,
    });
    return { success: true, library };
  } catch (error) {
    console.error('Error añadiendo carpeta:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Eliminar carpeta monitorizada
 */
registerHandler('library:removeFolder', async (_event, libraryId: string) => {
  try {
    const success = databaseService.deleteLibrary(libraryId);
    return { success };
  } catch (error) {
    console.error('Error eliminando carpeta:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Obtener carpetas monitorizadas
 */
registerHandler('library:getFolders', async () => {
  try {
    const libraries = databaseService.getAllLibraries();
    return { success: true, libraries };
  } catch (error) {
    console.error('Error obteniendo carpetas:', error);
    return { success: false, libraries: [] };
  }
});

/**
 * Actualizar biblioteca
 */
registerHandler('library:updateLibrary', async (_event, libraryId: string, data: { name?: string; path?: string; is_active?: number }) => {
  try {
    const library = databaseService.updateLibrary(libraryId, data);
    return { success: true, library };
  } catch (error) {
    console.error('Error actualizando biblioteca:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Búsqueda en biblioteca local
 */
registerHandler('library:search', async (_event, query: string) => {
  try {
    const results = databaseService.search(query);
    return { success: true, ...results };
  } catch (error) {
    console.error('Error buscando:', error);
    return { success: false, tracks: [], artists: [], albums: [] };
  }
});

/**
 * Obtener canciones favoritas
 */
registerHandler('library:getFavorites', async () => {
  try {
    const tracks = databaseService.getFavoriteTracks();
    return { success: true, tracks };
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return { success: false, tracks: [] };
  }
});

/**
 * Alternar favorito
 */
registerHandler('library:toggleFavorite', async (_event, trackId: string) => {
  try {
    const isFavorite = databaseService.toggleFavorite(trackId);
    return { success: true, isFavorite };
  } catch (error) {
    console.error('Error alternando favorito:', error);
    return { success: false, isFavorite: false };
  }
});

/**
 * Obtener canciones reproducidas recientemente
 */
registerHandler('library:getRecentlyPlayed', async (_event, limit?: number) => {
  try {
    const tracks = databaseService.getRecentlyPlayedTracks(limit);
    return { success: true, tracks };
  } catch (error) {
    console.error('Error obteniendo recientes:', error);
    return { success: false, tracks: [] };
  }
});

/**
 * Obtener estadísticas de la biblioteca
 */
registerHandler('library:getStats', async () => {
  try {
    const stats = databaseService.getLibraryStats();
    return { success: true, stats };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { success: false, stats: null };
  }
});

/**
 * Eliminar canción de la biblioteca
 */
registerHandler('library:deleteTrack', async (_event, trackId: string) => {
  try {
    const success = databaseService.deleteTrack(trackId);
    return { success };
  } catch (error) {
    console.error('Error eliminando canción:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Actualizar metadatos de canción
 */
registerHandler('library:updateTrack', async (_event, trackId: string, data: Record<string, unknown>) => {
  try {
    const track = databaseService.updateTrack(trackId, data);
    return { success: true, track };
  } catch (error) {
    console.error('Error actualizando canción:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

// ==================== PLAYLISTS ====================

/**
 * Obtener todas las playlists
 */
registerHandler('library:getPlaylists', async () => {
  try {
    const playlists = databaseService.getAllPlaylists();
    return { success: true, playlists };
  } catch (error) {
    console.error('Error obteniendo playlists:', error);
    return { success: false, playlists: [] };
  }
});

/**
 * Crear playlist
 */
registerHandler('library:createPlaylist', async (_event, name: string, description?: string) => {
  try {
    const playlist = databaseService.addPlaylist({
      name,
      description,
      is_smart: 0,
      is_system: 0,
    });
    return { success: true, playlist };
  } catch (error) {
    console.error('Error creando playlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Eliminar playlist
 */
registerHandler('library:deletePlaylist', async (_event, playlistId: string) => {
  try {
    const success = databaseService.deletePlaylist(playlistId);
    return { success };
  } catch (error) {
    console.error('Error eliminando playlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Añadir canción a playlist
 */
registerHandler('library:addToPlaylist', async (_event, playlistId: string, trackId: string) => {
  try {
    databaseService.addTrackToPlaylist(playlistId, trackId);
    return { success: true };
  } catch (error) {
    console.error('Error añadiendo a playlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Eliminar canción de playlist
 */
registerHandler('library:removeFromPlaylist', async (_event, playlistId: string, trackId: string) => {
  try {
    databaseService.removeTrackFromPlaylist(playlistId, trackId);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando de playlist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Obtener canciones de playlist
 */
registerHandler('library:getPlaylistTracks', async (_event, playlistId: string) => {
  try {
    const tracks = databaseService.getPlaylistTracks(playlistId);
    return { success: true, tracks };
  } catch (error) {
    console.error('Error obteniendo canciones de playlist:', error);
    return { success: false, tracks: [] };
  }
});

// ==================== COLA DE REPRODUCCIÓN ====================

/**
 * Añadir a cola de reproducción
 */
registerHandler('library:addToQueue', async (_event, trackId: string, sourceType?: string, sourceId?: string) => {
  try {
    const position = databaseService.addToQueue(trackId, sourceType, sourceId);
    return { success: true, position };
  } catch (error) {
    console.error('Error añadiendo a cola:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Obtener cola de reproducción
 */
registerHandler('library:getQueue', async () => {
  try {
    const queue = databaseService.getQueue();
    return { success: true, queue };
  } catch (error) {
    console.error('Error obteniendo cola:', error);
    return { success: false, queue: [] };
  }
});

/**
 * Limpiar cola de reproducción
 */
registerHandler('library:clearQueue', async () => {
  try {
    databaseService.clearQueue();
    return { success: true };
  } catch (error) {
    console.error('Error limpiando cola:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Eliminar de la cola
 */
registerHandler('library:removeFromQueue', async (_event, queueItemId: number) => {
  try {
    databaseService.removeFromQueue(queueItemId);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando de cola:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

// ==================== EXCLUSIONES ====================

/**
 * Añadir path a exclusión
 */
registerHandler('library:addExcludedPath', async (_event, pathToExclude: string) => {
  try {
    databaseService.addExcludedPath(pathToExclude);
    return { success: true };
  } catch (error) {
    console.error('Error añadiendo exclusión:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Eliminar path de exclusión
 */
registerHandler('library:removeExcludedPath', async (_event, pathToExclude: string) => {
  try {
    databaseService.removeExcludedPath(pathToExclude);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando exclusión:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});

/**
 * Obtener paths excluidos
 */
registerHandler('library:getExcludedPaths', async () => {
  try {
    const paths = databaseService.getExcludedPaths();
    return { success: true, paths };
  } catch (error) {
    console.error('Error obteniendo exclusiones:', error);
    return { success: false, paths: [] };
  }
});
