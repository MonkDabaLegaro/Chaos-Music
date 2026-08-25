/**
 * Handlers IPC para el servicio de YouTube
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { AudioExtractOptions, YouTubeSearchOptions } from '../services/youtube/types';
import { youtubeService } from '../services/youtube/youtube.service';

/**
 * Handler para buscar videos en YouTube
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_SEARCH, async (_event: IpcMainInvokeEvent, options: Partial<YouTubeSearchOptions>) => {
  try {
    const result = await youtubeService.search(options);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener información de un video específico
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_VIDEO, async (_event: IpcMainInvokeEvent, videoId: string) => {
  try {
    const video = await youtubeService.getVideo(videoId);
    return { success: true, data: video };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener URL de streaming de audio
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_STREAM_URL, async (_event: IpcMainInvokeEvent, videoId: string) => {
  try {
    const streamConfig = await youtubeService.getStreamUrl(videoId);
    return { success: true, data: streamConfig };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para extraer audio de un video
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_EXTRACT_AUDIO, async (_event: IpcMainInvokeEvent, videoId: string, options?: Partial<AudioExtractOptions>) => {
  try {
    const metadata = await youtubeService.extractAudio(videoId, options);
    return { success: true, data: metadata };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener videos trending
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_TRENDING, async (_event: IpcMainInvokeEvent, categoryId?: string) => {
  try {
    const videos = await youtubeService.getTrending(categoryId);
    return { success: true, data: videos };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener recomendaciones basadas en un video
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_RECOMMENDATIONS, async (_event: IpcMainInvokeEvent, videoId: string) => {
  try {
    const recommendations = await youtubeService.getRecommendations(videoId);
    return { success: true, data: recommendations };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener playlist
 */
ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_PLAYLIST, async (_event: IpcMainInvokeEvent, playlistId: string) => {
  try {
    const playlist = await youtubeService.getPlaylist(playlistId);
    return { success: true, data: playlist };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

console.log('YouTube IPC handlers registered');
