/**
 * Handlers IPC para el servicio de reproducción de audio
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { audioPlayerService } from '../services/audioPlayer/audioPlayer.service';
import { RepeatMode } from '../services/audioPlayer/types';
import { IPC_CHANNELS } from '../shared/constants';

/**
 * Handler para iniciar/reanudar reproducción
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_PLAY, async () => {
  try {
    await audioPlayerService.play();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para pausar reproducción
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_PAUSE, async () => {
  try {
    await audioPlayerService.pause();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para detener reproducción
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_STOP, async () => {
  try {
    await audioPlayerService.stop();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para ir a la siguiente canción
 */
ipcMain.handle('player:next', async () => {
  try {
    await audioPlayerService.next();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para ir a la canción anterior
 */
ipcMain.handle('player:previous', async () => {
  try {
    await audioPlayerService.previous();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para buscar posición específica
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_SEEK, async (_event: IpcMainInvokeEvent, position: number) => {
  try {
    await audioPlayerService.seek(position);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para avance rápido
 */
ipcMain.handle('player:fastForward', async (_event: IpcMainInvokeEvent, seconds: number = 10) => {
  try {
    await audioPlayerService.fastForward(seconds);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para retroceso rápido
 */
ipcMain.handle('player:rewind', async (_event: IpcMainInvokeEvent, seconds: number = 10) => {
  try {
    await audioPlayerService.rewind(seconds);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para establecer volumen
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_SET_VOLUME, async (_event: IpcMainInvokeEvent, volume: number) => {
  try {
    await audioPlayerService.setVolume(volume);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para silenciar/activar sonido
 */
ipcMain.handle('player:setMute', async (_event: IpcMainInvokeEvent, muted: boolean) => {
  try {
    await audioPlayerService.setMute(muted);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener estado del reproductor
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_GET_STATUS, async () => {
  try {
    const state = audioPlayerService.getState();
    return { success: true, data: state };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para activar/desactivar shuffle
 */
ipcMain.handle('player:setShuffle', async (_event: IpcMainInvokeEvent, enabled: boolean) => {
  try {
    audioPlayerService.setShuffle(enabled);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para cambiar modo repeat
 */
ipcMain.handle('player:setRepeat', async (_event: IpcMainInvokeEvent, mode: RepeatMode) => {
  try {
    audioPlayerService.setRepeatMode(mode);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para añadir canciones a la cola
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_ADD_TO_QUEUE, async (_event: IpcMainInvokeEvent, tracks: any[], playNow: boolean = false) => {
  try {
    await audioPlayerService.addToQueue(tracks, playNow);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para eliminar de la cola
 */
ipcMain.handle('player:removeFromQueue', async (_event: IpcMainInvokeEvent, itemId: string) => {
  try {
    await audioPlayerService.removeFromQueue(itemId);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para reordenar la cola
 */
ipcMain.handle('player:reorderQueue', async (_event: IpcMainInvokeEvent, fromIndex: number, toIndex: number) => {
  try {
    await audioPlayerService.reorderQueue(fromIndex, toIndex);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para limpiar la cola
 */
ipcMain.handle(IPC_CHANNELS.PLAYER_CLEAR_QUEUE, async () => {
  try {
    await audioPlayerService.clearQueue();
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para reproducir un elemento específico de la cola
 */
ipcMain.handle('player:playQueueItem', async (_event: IpcMainInvokeEvent, index: number) => {
  try {
    await audioPlayerService.playQueueItem(index);
    return { success: true, data: audioPlayerService.getState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener la cola actual
 */
ipcMain.handle('player:getQueue', async () => {
  try {
    const queue = audioPlayerService.getQueue();
    return { success: true, data: queue };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para configurar el ecualizador
 */
ipcMain.handle('player:setEqualizer', async (_event: IpcMainInvokeEvent, bandIndex: number, gain: number) => {
  try {
    audioPlayerService.setEqualizerBand(bandIndex, gain);
    return { success: true, data: audioPlayerService.getEqualizerState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para aplicar un preset del ecualizador
 */
ipcMain.handle('player:applyEqualizerPreset', async (_event: IpcMainInvokeEvent, presetName: string) => {
  try {
    audioPlayerService.applyEqualizerPreset(presetName);
    return { success: true, data: audioPlayerService.getEqualizerState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para obtener las bandas del ecualizador
 */
ipcMain.handle('player:getEqualizerBands', async () => {
  try {
    const state = audioPlayerService.getEqualizerState();
    return { success: true, data: state };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para resetear el ecualizador
 */
ipcMain.handle('player:resetEqualizer', async () => {
  try {
    audioPlayerService.resetEqualizer();
    return { success: true, data: audioPlayerService.getEqualizerState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

/**
 * Handler para activar/desactivar el ecualizador
 */
ipcMain.handle('player:setEqualizerEnabled', async (_event: IpcMainInvokeEvent, enabled: boolean) => {
  try {
    audioPlayerService.setEqualizerEnabled(enabled);
    return { success: true, data: audioPlayerService.getEqualizerState() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

console.log('Player IPC handlers registered');
