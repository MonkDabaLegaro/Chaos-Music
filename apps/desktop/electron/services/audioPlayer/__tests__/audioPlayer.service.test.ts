/**
 * Pruebas Unitarias para AudioPlayerService
 */

// Mock de AudioContext y HTMLAudioElement
const mockAudioContext = {
  state: 'running',
  createMediaElementSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
  createGain: jest.fn().mockReturnValue({
    gain: { value: 0.8 },
    connect: jest.fn(),
  }),
  createBiquadFilter: jest.fn().mockReturnValue({
    type: 'peaking',
    frequency: { value: 1000 },
    gain: { value: 0 },
    Q: { value: 1 },
    connect: jest.fn(),
  }),
  destination: {},
  resume: jest.fn().mockResolvedValue(undefined),
  suspend: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockAudioElement = {
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  load: jest.fn(),
  currentTime: 0,
  duration: 180,
  volume: 0.8,
  muted: false,
  crossOrigin: '',
  preload: '',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

// Mock global de AudioContext
global.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);
global.webkitAudioContext = jest.fn().mockImplementation(() => mockAudioContext);

// Mock de HTMLAudioElement
const MockHTMLAudioElement = jest.fn().mockImplementation(() => mockAudioElement);
Object.defineProperty(window, 'HTMLAudioElement', {
  writable: true,
  configurable: true,
  value: MockHTMLAudioElement,
});

describe('AudioPlayerService', () => {
  let audioPlayerService: typeof import('../audioPlayer.service').AudioPlayerService;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Importar el servicio
    const AudioPlayerModule = require('../audioPlayer.service');
    audioPlayerService = new AudioPlayerModule.AudioPlayerService();
  });

  describe('constructor', () => {
    it('debería inicializar el estado correctamente', () => {
      const state = audioPlayerService.getState();

      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.isStopped).toBe(true);
      expect(state.currentTrack).toBeNull();
      expect(state.queue).toEqual([]);
      expect(state.queueIndex).toBe(-1);
      expect(state.position).toBe(0);
      expect(state.volume).toBe(80); // DEFAULT_VOLUME
      expect(state.isMuted).toBe(false);
      expect(state.repeatMode).toBe('off');
      expect(state.shuffle).toBe(false);
    });
  });

  describe('play', () => {
    it('debería reproducir correctamente', async () => {
      await audioPlayerService.play();

      expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    it('no debería hacer nada si no hay canción en cola', async () => {
      await audioPlayerService.play();

      expect(mockAudioElement.play).not.toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('debería pausar correctamente', async () => {
      await audioPlayerService.pause();

      expect(mockAudioElement.pause).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('debería detener correctamente', async () => {
      await audioPlayerService.stop();

      expect(mockAudioElement.pause).toHaveBeenCalled();
      expect(mockAudioElement.currentTime).toBe(0);
    });
  });

  describe('togglePlay', () => {
    it('debería alternar entre play y pause', async () => {
      await audioPlayerService.togglePlay();

      expect(mockAudioElement.play).toHaveBeenCalled();
    });
  });

  describe('seek', () => {
    it('debería buscar a una posición específica', async () => {
      await audioPlayerService.seek(60);

      expect(mockAudioElement.currentTime).toBe(60);
    });

    it('debería limitar la posición al duration', async () => {
      await audioPlayerService.seek(300);

      expect(mockAudioElement.currentTime).toBeLessThanOrEqual(mockAudioElement.duration);
    });
  });

  describe('setVolume', () => {
    it('debería establecer el volumen correctamente', async () => {
      await audioPlayerService.setVolume(50);

      expect(mockAudioElement.volume).toBe(0.5);
    });

    it('debería limitar el volumen entre 0 y 100', async () => {
      await audioPlayerService.setVolume(150);

      expect(mockAudioElement.volume).toBe(1);
    });

    it('debería manejar volumen negativo', async () => {
      await audioPlayerService.setVolume(-10);

      expect(mockAudioElement.volume).toBe(0);
    });
  });

  describe('setMute', () => {
    it('debería silenciar correctamente', async () => {
      await audioPlayerService.setMute(true);

      expect(mockAudioElement.muted).toBe(true);
    });

    it('debería activar el sonido correctamente', async () => {
      await audioPlayerService.setMute(true);
      await audioPlayerService.setMute(false);

      expect(mockAudioElement.muted).toBe(false);
    });
  });

  describe('toggleMute', () => {
    it('debería alternar el silencio', async () => {
      await audioPlayerService.toggleMute();

      expect(mockAudioElement.muted).toBe(true);
    });
  });

  describe('setShuffle', () => {
    it('debería activar shuffle', () => {
      audioPlayerService.setShuffle(true);

      const state = audioPlayerService.getState();
      expect(state.shuffle).toBe(true);
    });

    it('debería desactivar shuffle', () => {
      audioPlayerService.setShuffle(true);
      audioPlayerService.setShuffle(false);

      const state = audioPlayerService.getState();
      expect(state.shuffle).toBe(false);
    });
  });

  describe('toggleShuffle', () => {
    it('debería alternar shuffle', () => {
      audioPlayerService.toggleShuffle();

      const state = audioPlayerService.getState();
      expect(state.shuffle).toBe(true);
    });
  });

  describe('setRepeatMode', () => {
    it('debería establecer el modo de repetición', () => {
      audioPlayerService.setRepeatMode('all');

      const state = audioPlayerService.getState();
      expect(state.repeatMode).toBe('all');
    });

    it('debería soportar todos los modos', () => {
      audioPlayerService.setRepeatMode('one');

      const state = audioPlayerService.getState();
      expect(state.repeatMode).toBe('one');
    });
  });

  describe('cycleRepeatMode', () => {
    it('debería ciclar entre los modos de repetición', () => {
      audioPlayerService.cycleRepeatMode(); // off -> all
      let state = audioPlayerService.getState();
      expect(state.repeatMode).toBe('all');

      audioPlayerService.cycleRepeatMode(); // all -> one
      state = audioPlayerService.getState();
      expect(state.repeatMode).toBe('one');

      audioPlayerService.cycleRepeatMode(); // one -> off
      state = audioPlayerService.getState();
      expect(state.repeatMode).toBe('off');
    });
  });

  describe('fastForward', () => {
    it('debería avanzar rápidamente', async () => {
      await audioPlayerService.fastForward(10);

      expect(mockAudioElement.currentTime).toBe(10);
    });
  });

  describe('rewind', () => {
    it('debería retroceder rápidamente', async () => {
      mockAudioElement.currentTime = 20;
      await audioPlayerService.rewind(10);

      expect(mockAudioElement.currentTime).toBe(10);
    });

    it('no debería ir por debajo de 0', async () => {
      mockAudioElement.currentTime = 5;
      await audioPlayerService.rewind(10);

      expect(mockAudioElement.currentTime).toBe(0);
    });
  });

  describe('event handling', () => {
    it('debería agregar listener de eventos', () => {
      const callback = jest.fn();

      audioPlayerService.on('play', callback);
      audioPlayerService.on('pause', callback);

      // Simular evento play
      const playListeners = (mockAudioElement.addEventListener as jest.Mock)
        .mock.calls.find((call: any[]) => call[0] === 'play')?.[1];

      if (playListeners) {
        playListeners();
      }

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getState', () => {
    it('debería retornar el estado actual', () => {
      const state = audioPlayerService.getState();

      expect(state).toBeDefined();
      expect(state.isPlaying).toBeDefined();
      expect(state.currentTrack).toBeDefined();
      expect(state.queue).toBeDefined();
    });
  });
});
