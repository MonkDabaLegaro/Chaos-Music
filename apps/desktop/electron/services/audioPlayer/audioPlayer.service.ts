/**
 * Servicio de reproducción de audio
 * Maneja la reproducción de audio con Web Audio API, ecualizador y cola de reproducción
 */

import { BrowserWindow } from 'electron';
import { Track } from '../../shared/types';
import {
    AudioSource,
    EQUALIZER_BAND_FREQUENCIES,
    EQUALIZER_PRESETS,
    EqualizerBand,
    EqualizerState,
    PlaybackEventCallback,
    PlaybackEventType,
    PlaybackState,
    QueueItem,
    RepeatMode,
} from './types';

// ============ Constantes ============

const DEFAULT_VOLUME = 80;
const MAX_VOLUME = 100;
const MIN_VOLUME = 0;
const PROGRESS_UPDATE_INTERVAL = 100; // ms
const CROSSFADE_DURATION = 2; // segundos
const FADE_IN_DURATION = 0.5; // segundos
const FADE_OUT_DURATION = 0.5; // segundos

// ============ Clase AudioPlayerService ============

export class AudioPlayerService {
  // Estado del reproductor
  private state: PlaybackState;
  
  // Elementos de audio
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  
  // Nodos del ecualizador
  private equalizerFilters: BiquadFilterNode[] = [];
  private equalizerEnabled = false;
  private equalizerState: EqualizerState;
  
  // Gestión de cola
  private queue: QueueItem[] = [];
  private originalQueueOrder: number[] = []; // Para restaurar después de shuffle
  
  // Temporizadores
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private fadeTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Callbacks de eventos
  private eventCallbacks: Map<PlaybackEventType, Set<PlaybackEventCallback>> = new Map();
  
  // Referencia a la ventana para enviar eventos al renderer
  private window: BrowserWindow | null = null;
  
  constructor() {
    // Inicializar estado
    this.state = {
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      position: 0,
      duration: 0,
      volume: DEFAULT_VOLUME,
      isMuted: false,
      repeatMode: 'off',
      shuffle: false,
      isLoading: false,
      error: null,
    };
    
    // Inicializar ecualizador
    this.equalizerState = {
      isEnabled: false,
      bands: this.createDefaultEqualizerBands(),
      currentPreset: null,
    };
    
    // Inicializar audio
    this.initializeAudio();
  }
  
  // ============ Inicialización ============
  
  /**
   * Inicializa el contexto de audio y el elemento de audio
   */
  private initializeAudio(): void {
    try {
      // Crear contexto de audio
      this.audioContext = new AudioContext();
      
      // Crear elemento de audio
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'metadata';
      
      // Conectar elemento al contexto
      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      
      // Crear nodo de ganancia para volumen
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.state.volume / MAX_VOLUME;
      
      // Inicializar ecualizador
      this.initializeEqualizer();
      
      // Configurar eventos del elemento de audio
      this.setupAudioElementEvents();
      
      console.log('AudioPlayerService inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar AudioPlayerService:', error);
      this.state.error = 'Error al inicializar el audio';
    }
  }
  
  /**
   * Inicializa los filtros del ecualizador
   */
  private initializeEqualizer(): void {
    if (!this.audioContext) return;
    
    this.equalizerFilters = EQUALIZER_BAND_FREQUENCIES.map((frequency) => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.gain.value = 0;
      filter.Q.value = 1;
      return filter;
    });
    
    // Conectar filtros en cadena
    this.connectEqualizerChain();
  }
  
  /**
   * Conecta los filtros del ecualizador en cadena
   */
  private connectEqualizerChain(): void {
    if (!this.sourceNode || !this.gainNode || this.equalizerFilters.length === 0) return;
    
    // Desconectar todo primero
    this.sourceNode.disconnect();
    
    // Conectar source -> primer filtro -> ... -> último filtro -> gain -> destination
    let previousNode: AudioNode = this.sourceNode;
    
    for (const filter of this.equalizerFilters) {
      previousNode.connect(filter);
      previousNode = filter;
    }
    
    previousNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext!.destination);
  }
  
  /**
   * Configura los eventos del elemento de audio
   */
  private setupAudioElementEvents(): void {
    if (!this.audioElement) return;
    
    this.audioElement.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.isStopped = false;
      this.state.error = null;
      this.emitEvent('play');
      this.startProgressUpdates();
    });
    
    this.audioElement.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.state.isPaused = true;
      this.emitEvent('pause');
      this.stopProgressUpdates();
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnded();
    });
    
    this.audioElement.addEventListener('timeupdate', () => {
      this.state.position = this.audioElement?.currentTime || 0;
      this.emitEvent('timeupdate');
    });
    
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.state.duration = this.audioElement?.duration || 0;
      this.state.isLoading = false;
    });
    
    this.audioElement.addEventListener('waiting', () => {
      this.state.isLoading = true;
    });
    
    this.audioElement.addEventListener('canplay', () => {
      this.state.isLoading = false;
    });
    
    this.audioElement.addEventListener('error', (e) => {
      const error = this.audioElement?.error;
      this.state.error = error?.message || 'Error desconocido';
      this.emitEvent('error');
    });
    
    this.audioElement.addEventListener('volumechange', () => {
      this.state.volume = (this.audioElement?.volume || 0) * MAX_VOLUME;
      this.state.isMuted = this.audioElement?.muted || false;
      this.emitEvent(this.state.isMuted ? 'muted' : 'volumechange');
    });
  }
  
  // ============ Control de Reproducción ============
  
  /**
   * Inicia o reanuda la reproducción
   */
  async play(): Promise<void> {
    if (!this.audioElement || !this.audioContext) {
      throw new Error('Audio no inicializado');
    }
    
    // Si no hay canción en cola, no hacer nada
    if (!this.state.currentTrack && this.queue.length === 0) {
      return;
    }
    
    // Si no hay canción actual pero hay cola, reproducir la primera
    if (!this.state.currentTrack && this.queue.length > 0) {
      await this.playQueueItem(0);
      return;
    }
    
    // Resumir reproducción
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    // Aplicar fade in si está configurado
    if (this.state.currentTrack) {
      await this.fadeIn(FADE_IN_DURATION);
    }
    
    await this.audioElement.play();
  }
  
  /**
   * Pausa la reproducción
   */
  async pause(): Promise<void> {
    if (!this.audioElement) return;
    
    // Aplicar fade out antes de pausar
    if (this.state.isPlaying) {
      await this.fadeOut(FADE_OUT_DURATION);
    }
    
    await this.audioElement.pause();
    this.state.isPaused = true;
    this.state.isPlaying = false;
  }
  
  /**
   * Detiene la reproducción
   */
  async stop(): Promise<void> {
    if (!this.audioElement) return;
    
    // Aplicar fade out
    await this.fadeOut(FADE_OUT_DURATION);
    
    await this.audioElement.pause();
    this.audioElement.currentTime = 0;
    
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.isStopped = true;
    this.state.position = 0;
    
    this.stopProgressUpdates();
    this.emitEvent('stop');
  }
  
  /**
   * Alterna entre play y pause
   */
  async togglePlay(): Promise<void> {
    if (this.state.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }
  
  /**
   * Reproduce la siguiente canción
   */
  async next(): Promise<void> {
    const nextIndex = this.getNextIndex();
    
    if (nextIndex !== -1) {
      await this.playQueueItem(nextIndex);
    } else if (this.state.repeatMode === 'all' && this.queue.length > 0) {
      // Si repeat all y llegamos al final, volver al inicio
      await this.playQueueItem(0);
    } else {
      // No hay siguiente canción, detener
      await this.stop();
    }
  }
  
  /**
   * Reproduce la canción anterior
   */
  async previous(): Promise<void> {
    // Si estamos más de 3 segundos en la canción, reiniciar
    if (this.audioElement && this.audioElement.currentTime > 3) {
      await this.seek(0);
      return;
    }
    
    const previousIndex = this.getPreviousIndex();
    
    if (previousIndex !== -1) {
      await this.playQueueItem(previousIndex);
    }
  }
  
  /**
   * Busca a una posición específica
   */
  async seek(position: number): Promise<void> {
    if (!this.audioElement) return;
    
    const clampedPosition = Math.max(0, Math.min(position, this.state.duration));
    this.audioElement.currentTime = clampedPosition;
    this.state.position = clampedPosition;
    
    this.emitEvent('progress');
  }
  
  /**
   * Avanza rápidamente
   */
  async fastForward(seconds: number = 10): Promise<void> {
    const newPosition = this.state.position + seconds;
    await this.seek(newPosition);
  }
  
  /**
   * Retrocede rápidamente
   */
  async rewind(seconds: number = 10): Promise<void> {
    const newPosition = this.state.position - seconds;
    await this.seek(Math.max(0, newPosition));
  }
  
  // ============ Control de Volumen ============
  
  /**
   * Establece el volumen (0-100)
   */
  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(MIN_VOLUME, Math.min(volume, MAX_VOLUME));
    
    if (this.gainNode) {
      this.gainNode.gain.value = clampedVolume / MAX_VOLUME;
    }
    
    if (this.audioElement) {
      this.audioElement.volume = clampedVolume / MAX_VOLUME;
    }
    
    this.state.volume = clampedVolume;
    
    if (this.state.isMuted && clampedVolume > 0) {
      await this.setMute(false);
    }
    
    this.emitEvent('volumechange');
  }
  
  /**
   * silencia o activa el sonido
   */
  async setMute(muted: boolean): Promise<void> {
    if (!this.audioElement) return;
    
    this.audioElement.muted = muted;
    this.state.isMuted = muted;
    
    this.emitEvent(muted ? 'muted' : 'unmuted');
  }
  
  /**
   * Alterna el mute
   */
  async toggleMute(): Promise<void> {
    await this.setMute(!this.state.isMuted);
  }
  
  // ============ Modos de Reproducción ============
  
  /**
   * Activa o desactiva el modo shuffle
   */
  setShuffle(enabled: boolean): void {
    this.state.shuffle = enabled;
    
    if (enabled) {
      this.enableShuffle();
    } else {
      this.disableShuffle();
    }
    
    this.emitEvent('shufflechange');
  }
  
  /**
   * Activa el modo shuffle
   */
  private enableShuffle(): void {
    // Guardar el orden original
    this.originalQueueOrder = this.queue.map((_, index) => index);
    
    // Crear un array de índices mezclado
    const indices = this.queue.map((_, index) => index);
    
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Mover la canción actual al principio si existe
    const currentIndex = this.state.queueIndex;
    if (currentIndex !== -1) {
      const currentInShuffled = indices.indexOf(currentIndex);
      if (currentInShuffled > 0) {
        [indices[0], indices[currentInShuffled]] = [indices[currentInShuffled], indices[0]];
      }
    }
    
    // Reordenar la cola
    const newQueue = indices.map((i) => this.queue[i]);
    this.queue = newQueue;
    this.state.queueIndex = 0;
    this.state.queue = this.queue;
  }
  
  /**
   * Desactiva el modo shuffle
   */
  private disableShuffle(): void {
    if (this.originalQueueOrder.length === 0) return;
    
    // Restaurar el orden original
    const newQueue = this.originalQueueOrder.map((i) => this.queue[i]);
    this.queue = newQueue;
    this.state.queueIndex = this.originalQueueOrder.indexOf(this.state.queueIndex);
    this.state.queue = this.queue;
    this.originalQueueOrder = [];
  }
  
  /**
   * Alterna el modo shuffle
   */
  toggleShuffle(): void {
    this.setShuffle(!this.state.shuffle);
  }
  
  /**
   * Cambia el modo de repetición
   */
  setRepeatMode(mode: RepeatMode): void {
    this.state.repeatMode = mode;
    this.emitEvent('repeatchange');
  }
  
  /**
   * Cambia al siguiente modo de repetición
   */
  cycleRepeatMode(): void {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(this.state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setRepeatMode(modes[nextIndex]);
  }
  
  // ============ Cola de Reproducción ============
  
  /**
   * Añade canciones a la cola
   */
  async addToQueue(tracks: Track[], playNow: boolean = false): Promise<void> {
    const newItems: QueueItem[] = tracks.map((track) => ({
      id: `${track.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      track,
      addedAt: Date.now(),
      playCount: 0,
    }));
    
    // Insertar en la cola
    this.queue.push(...newItems);
    this.state.queue = this.queue;
    
    // Si playNow o no hay canción actual, reproducir la primera añadida
    if (playNow || (!this.state.currentTrack && this.queue.length > 0)) {
      const playIndex = playNow 
        ? this.queue.length - newItems.length 
        : 0;
      await this.playQueueItem(playIndex);
    }
    
    this.emitEvent('queuechange');
  }
  
  /**
   * Elimina un elemento de la cola
   */
  async removeFromQueue(itemId: string): Promise<void> {
    const index = this.queue.findIndex((item) => item.id === itemId);
    
    if (index === -1) return;
    
    // Si es la canción actual, detenerla
    if (this.state.currentTrack?.id === itemId) {
      await this.stop();
      this.state.currentTrack = null;
    }
    
    // Eliminar de la cola
    this.queue.splice(index, 1);
    this.state.queue = this.queue;
    
    // Ajustar el índice si es necesario
    if (index < this.state.queueIndex) {
      this.state.queueIndex--;
    }
    
    this.emitEvent('queuechange');
  }
  
  /**
   * Reordena la cola
   */
  async reorderQueue(fromIndex: number, toIndex: number): Promise<void> {
    if (fromIndex < 0 || fromIndex >= this.queue.length) return;
    if (toIndex < 0 || toIndex >= this.queue.length) return;
    if (fromIndex === toIndex) return;
    
    // Mover el elemento
    const [removed] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, removed);
    this.state.queue = this.queue;
    
    // Actualizar el índice de la canción actual
    if (this.state.currentTrack) {
      this.state.queueIndex = this.queue.findIndex(
        (item) => item.id === this.state.currentTrack!.id
      );
    }
    
    this.emitEvent('queuechange');
  }
  
  /**
   * Limpia la cola
   */
  async clearQueue(): Promise<void> {
    await this.stop();
    this.queue = [];
    this.state.queue = [];
    this.state.currentTrack = null;
    this.state.queueIndex = -1;
    this.emitEvent('queuechange');
  }
  
  /**
   * Reproduce un elemento específico de la cola
   */
  async playQueueItem(index: number): Promise<void> {
    if (index < 0 || index >= this.queue.length) return;
    
    const item = this.queue[index];
    this.state.currentTrack = item;
    this.state.queueIndex = index;
    this.state.isLoading = true;
    
    // Reproducir la canción
    await this.loadAndPlay(item.track);
    
    // Incrementar contador de reproducciones
    item.playCount++;
    
    this.emitEvent('trackchange');
  }
  
  /**
   * Reproduce el siguiente elemento en cola (para autoplay)
   */
  private async playNextInQueue(): Promise<void> {
    const nextIndex = this.getNextIndex();
    if (nextIndex !== -1) {
      await this.playQueueItem(nextIndex);
    }
  }
  
  /**
   * Obtiene el índice de la siguiente canción
   */
  private getNextIndex(): number {
    if (this.queue.length === 0) return -1;
    
    if (this.state.repeatMode === 'one') {
      // Repeat one: reproducir la misma canción
      return this.state.queueIndex;
    }
    
    if (this.state.shuffle) {
      // Shuffle: siguiente canción mezclada
      const nextIndex = (this.state.queueIndex + 1) % this.queue.length;
      return nextIndex;
    }
    
    // Normal: siguiente canción en orden
    return (this.state.queueIndex + 1) % this.queue.length;
  }
  
  /**
   * Obtiene el índice de la canción anterior
   */
  private getPreviousIndex(): number {
    if (this.queue.length === 0) return -1;
    
    if (this.state.queueIndex > 0) {
      return this.state.queueIndex - 1;
    }
    
    // Si estamos en la primera canción, volver al final
    return this.queue.length - 1;
  }
  
  /**
   * Carga y reproduce una canción
   */
  private async loadAndPlay(track: Track): Promise<void> {
    if (!this.audioElement || !this.audioContext) return;
    
    // Resumir el contexto de audio si está suspendido
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    // Configurar la fuente de audio
    const source = this.createAudioSource(track);
    this.audioElement.src = source.url;
    this.audioElement.load();
    
    // Reproducir
    await this.play();
  }
  
  /**
   * Crea una fuente de audio para un track
   */
  private createAudioSource(track: Track): AudioSource {
    // Determinar si es un archivo local o remoto
    const isLocal = track.filePath.startsWith('file://') || 
                   !track.filePath.startsWith('http');
    
    return {
      type: isLocal ? 'local' : 'stream',
      url: isLocal ? track.filePath : track.filePath,
    };
  }
  
  // ============ Manejo de Transiciones ============
  
  /**
   * Aplica fade in
   */
  private async fadeIn(duration: number): Promise<void> {
    if (!this.audioContext || !this.gainNode || !this.audioElement) return;
    
    const now = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(
      this.state.volume / MAX_VOLUME,
      now + duration
    );
    
    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }
  
  /**
   * Aplica fade out
   */
  private async fadeOut(duration: number): Promise<void> {
    if (!this.audioContext || !this.gainNode || !this.audioElement) return;
    
    const now = this.audioContext.currentTime;
    const currentGain = this.gainNode.gain.value;
    this.gainNode.gain.setValueAtTime(currentGain, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + duration);
    
    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }
  
  /**
   * Maneja el final de una canción
   */
  private async handleTrackEnded(): Promise<void> {
    this.state.isPlaying = false;
    this.state.position = 0;
    
    if (this.state.repeatMode === 'one') {
      // Repeat one: reiniciar la misma canción
      await this.seek(0);
      await this.play();
    } else {
      // Ir a la siguiente canción
      await this.playNextInQueue();
    }
    
    this.emitEvent('ended');
  }
  
  // ============ Ecualizador ============
  
  /**
   * Crea las bandas por defecto del ecualizador
   */
  private createDefaultEqualizerBands(): EqualizerBand[] {
    return EQUALIZER_BAND_FREQUENCIES.map((frequency, index) => ({
      index,
      frequency,
      gain: 0,
      quality: 1,
    }));
  }
  
  /**
   * Establece el valor de una banda del ecualizador
   */
  setEqualizerBand(bandIndex: number, gain: number): void {
    if (bandIndex < 0 || bandIndex >= this.equalizerFilters.length) return;
    
    // Limitar el gain
    const clampedGain = Math.max(-12, Math.min(12, gain));
    
    // Actualizar el filtro
    const filter = this.equalizerFilters[bandIndex];
    filter.gain.value = clampedGain;
    
    // Actualizar el estado
    this.equalizerState.bands[bandIndex].gain = clampedGain;
    this.equalizerState.currentPreset = null; // Ya no estamos usando un preset
    
    this.emitEqualizerState();
  }
  
  /**
   * Aplica un preset del ecualizador
   */
  applyEqualizerPreset(presetName: string): void {
    const preset = EQUALIZER_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    
    // Aplicar el preset a cada banda
    preset.bands.forEach((gain, index) => {
      if (index < this.equalizerFilters.length) {
        const filter = this.equalizerFilters[index];
        filter.gain.value = gain;
        this.equalizerState.bands[index].gain = gain;
      }
    });
    
    this.equalizerState.currentPreset = presetName;
    this.emitEqualizerState();
  }
  
  /**
   * Resetea el ecualizador a valores planos
   */
  resetEqualizer(): void {
    this.equalizerFilters.forEach((filter) => {
      filter.gain.value = 0;
    });
    
    this.equalizerState.bands.forEach((band) => {
      band.gain = 0;
    });
    
    this.equalizerState.currentPreset = null;
    this.emitEqualizerState();
  }
  
  /**
   * Activa o desactiva el ecualizador
   */
  setEqualizerEnabled(enabled: boolean): void {
    this.equalizerEnabled = enabled;
    this.equalizerState.isEnabled = enabled;
    
    // Conectar o desconectar el ecualizador
    if (enabled) {
      this.connectEqualizerChain();
    } else {
      this.connectSourceDirectly();
    }
    
    this.emitEqualizerState();
  }
  
  /**
   * Conecta la fuente directamente al gain (sin ecualizador)
   */
  private connectSourceDirectly(): void {
    if (!this.sourceNode || !this.gainNode) return;
    
    this.sourceNode.disconnect();
    this.sourceNode.connect(this.gainNode);
  }
  
  /**
   * Obtiene el estado actual del ecualizador
   */
  getEqualizerState(): EqualizerState {
    return { ...this.equalizerState };
  }
  
  /**
   * Envía el estado del ecualizador al renderer
   */
  private emitEqualizerState(): void {
    if (this.window) {
      this.window.webContents.send('player:equalizerState', this.equalizerState);
    }
  }
  
  // ============ Actualizaciones de Progreso ============
  
  /**
   * Inicia las actualizaciones de progreso
   */
  private startProgressUpdates(): void {
    if (this.progressInterval) return;
    
    this.progressInterval = setInterval(() => {
      if (this.audioElement && this.state.isPlaying) {
        this.state.position = this.audioElement.currentTime;
        this.emitEvent('progress');
      }
    }, PROGRESS_UPDATE_INTERVAL);
  }
  
  /**
   * Detiene las actualizaciones de progreso
   */
  private stopProgressUpdates(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
  // ============ Gestión de Eventos ============
  
  /**
   * Registra un callback para un evento
   */
  on(event: PlaybackEventType, callback: PlaybackEventCallback): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, new Set());
    }
    this.eventCallbacks.get(event)!.add(callback);
  }
  
  /**
   * Elimina un callback de un evento
   */
  off(event: PlaybackEventType, callback: PlaybackEventCallback): void {
    this.eventCallbacks.get(event)?.delete(callback);
  }
  
  /**
   * Emite un evento a todos los callbacks registrados
   */
  private emitEvent(event: PlaybackEventType): void {
    // Enviar al renderer
    if (this.window) {
      this.window.webContents.send(`player:${event}`, this.state);
    }
    
    // Enviar a los callbacks locales
    this.eventCallbacks.get(event)?.forEach((callback) => {
      try {
        callback(this.state);
      } catch (error) {
        console.error(`Error en callback de evento ${event}:`, error);
      }
    });
  }
  
  // ============ Estado ============
  
  /**
   * Obtiene el estado actual del reproductor
   */
  getState(): PlaybackState {
    return { ...this.state };
  }
  
  /**
   * Obtiene la cola actual
   */
  getQueue(): QueueItem[] {
    return [...this.queue];
  }
  
  /**
   * Establece la referencia a la ventana para comunicación con el renderer
   */
  setWindow(window: BrowserWindow): void {
    this.window = window;
  }
  
  /**
   * Libera los recursos
   */
  destroy(): void {
    this.stopProgressUpdates();
    
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.queue = [];
    this.state.queue = [];
    this.state.currentTrack = null;
  }
}

// Exportar instancia única del servicio
export const audioPlayerService = new AudioPlayerService();
