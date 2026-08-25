/**
 * Pruebas Unitarias para PlayerSlice
 */

import playerSlice, {
    addToQueue,
    clearQueue,
    playNext,
    playPrevious,
    removeFromQueue,
    setCurrentTrack,
    setIsPlaying,
    setPlayerState,
    setPosition,
    setQueue,
    setRepeatMode,
    setShuffle,
    setVolume,
} from '../player.slice';

describe('playerSlice', () => {
  const initialState = {
    isPlaying: false,
    currentTrack: null,
    queue: [],
    position: 0,
    volume: 1,
    repeatMode: 'off' as const,
    shuffle: false,
  };

  describe('acciones básicas', () => {
    it('debería retornar el estado inicial', () => {
      const state = playerSlice(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    it('debería setear isPlaying', () => {
      const state = playerSlice(initialState, setIsPlaying(true));
      expect(state.isPlaying).toBe(true);
    });

    it('debería setear isPlaying a false', () => {
      const state = playerSlice({ ...initialState, isPlaying: true }, setIsPlaying(false));
      expect(state.isPlaying).toBe(false);
    });

    it('debería setear currentTrack', () => {
      const track = { id: '1', title: 'Test Track', duration: 180 } as any;
      const state = playerSlice(initialState, setCurrentTrack(track));
      expect(state.currentTrack).toEqual(track);
    });

    it('debería setear currentTrack a null', () => {
      const track = { id: '1', title: 'Test Track', duration: 180 } as any;
      const state = playerSlice({ ...initialState, currentTrack: track }, setCurrentTrack(null));
      expect(state.currentTrack).toBeNull();
    });

    it('debería setear queue', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const state = playerSlice(initialState, setQueue(queue));
      expect(state.queue).toEqual(queue);
    });

    it('debería agregar una canción a la cola', () => {
      const track = { id: '1', title: 'Test Track', duration: 180 } as any;
      const state = playerSlice(initialState, addToQueue(track));
      expect(state.queue).toHaveLength(1);
      expect(state.queue[0]).toEqual(track);
    });

    it('debería agregar múltiples canciones a la cola', () => {
      const tracks = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const state = playerSlice(initialState, addToQueue(tracks));
      expect(state.queue).toHaveLength(2);
    });

    it('debería remover una canción de la cola', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const state = playerSlice({ ...initialState, queue }, removeFromQueue(0));
      expect(state.queue).toHaveLength(1);
      expect(state.queue[0].id).toBe('2');
    });

    it('debería limpiar la cola', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const state = playerSlice({ ...initialState, queue }, clearQueue());
      expect(state.queue).toHaveLength(0);
    });

    it('debería setear position', () => {
      const state = playerSlice(initialState, setPosition(60));
      expect(state.position).toBe(60);
    });

    it('debería setear volume con clamp', () => {
      const state = playerSlice(initialState, setVolume(1.5));
      expect(state.volume).toBe(1);
    });

    it('debería setear volume mínimo', () => {
      const state = playerSlice(initialState, setVolume(-0.5));
      expect(state.volume).toBe(0);
    });

    it('debería setear repeatMode', () => {
      const state = playerSlice(initialState, setRepeatMode('all'));
      expect(state.repeatMode).toBe('all');
    });

    it('debería setear shuffle', () => {
      const state = playerSlice(initialState, setShuffle(true));
      expect(state.shuffle).toBe(true);
    });
  });

  describe('playNext', () => {
    it('debería reproducir la siguiente canción en la cola', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
        { id: '3', title: 'Track 3', duration: 220 } as any,
      ];
      const currentTrack = queue[0];
      const state = playerSlice(
        { ...initialState, queue, currentTrack, isPlaying: true },
        playNext()
      );
      expect(state.currentTrack?.id).toBe('2');
    });

    it('debería hacer loop en la cola', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const currentTrack = queue[1];
      const state = playerSlice(
        { ...initialState, queue, currentTrack, isPlaying: true },
        playNext()
      );
      expect(state.currentTrack?.id).toBe('1');
    });

    it('no debería hacer nada si la cola está vacía', () => {
      const currentTrack = { id: '1', title: 'Track 1', duration: 180 } as any;
      const state = playerSlice(
        { ...initialState, currentTrack },
        playNext()
      );
      expect(state.currentTrack).toEqual(currentTrack);
    });

    it('debería reproducir una canción aleatoria con shuffle activado', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
        { id: '3', title: 'Track 3', duration: 220 } as any,
      ];
      const currentTrack = queue[0];
      const state = playerSlice(
        { ...initialState, queue, currentTrack, shuffle: true, isPlaying: true },
        playNext()
      );
      expect(state.queue).toContainEqual(state.currentTrack);
    });
  });

  describe('playPrevious', () => {
    it('debería reproducir la canción anterior', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const currentTrack = queue[1];
      const state = playerSlice(
        { ...initialState, queue, currentTrack, isPlaying: true },
        playPrevious()
      );
      expect(state.currentTrack?.id).toBe('1');
    });

    it('debería volver al final de la cola', () => {
      const queue = [
        { id: '1', title: 'Track 1', duration: 180 } as any,
        { id: '2', title: 'Track 2', duration: 200 } as any,
      ];
      const currentTrack = queue[0];
      const state = playerSlice(
        { ...initialState, queue, currentTrack, isPlaying: true },
        playPrevious()
      );
      expect(state.currentTrack?.id).toBe('2');
    });
  });

  describe('setPlayerState', () => {
    it('debería actualizar el estado parcialmente', () => {
      const state = playerSlice(
        initialState,
        setPlayerState({ isPlaying: true, volume: 0.5 })
      );
      expect(state.isPlaying).toBe(true);
      expect(state.volume).toBe(0.5);
      expect(state.currentTrack).toBeNull();
    });

    it('debería actualizar currentTrack y queue', () => {
      const track = { id: '1', title: 'Track 1', duration: 180 } as any;
      const queue = [track];
      const state = playerSlice(
        initialState,
        setPlayerState({ currentTrack: track, queue })
      );
      expect(state.currentTrack).toEqual(track);
      expect(state.queue).toEqual(queue);
    });
  });
});
