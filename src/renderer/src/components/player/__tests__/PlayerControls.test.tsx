/**
 * Pruebas Unitarias para PlayerControls Component
 */

import { fireEvent, render, screen } from '@testing-library/react';
import PlayerControls from '../components/player/PlayerControls';

// Mock de iconos de Material UI
jest.mock('@mui/icons-material/Pause', () => ({
  default: () => <span data-testid="pause-icon">Pause</span>,
}));

jest.mock('@mui/icons-material/PlayArrow', () => ({
  default: () => <span data-testid="play-icon">Play</span>,
}));

jest.mock('@mui/icons-material/Repeat', () => ({
  default: () => <span data-testid="repeat-icon">Repeat</span>,
}));

jest.mock('@mui/icons-material/RepeatOne', () => ({
  default: () => <span data-testid="repeat-one-icon">RepeatOne</span>,
}));

jest.mock('@mui/icons-material/Shuffle', () => ({
  default: () => <span data-testid="shuffle-icon">Shuffle</span>,
}));

jest.mock('@mui/icons-material/SkipNext', () => ({
  default: () => <span data-testid="skip-next-icon">SkipNext</span>,
}));

jest.mock('@mui/icons-material/SkipPrevious', () => ({
  default: () => <span data-testid="skip-previous-icon">SkipPrevious</span>,
}));

describe('PlayerControls Component', () => {
  const defaultProps = {
    isPlaying: false,
    shuffle: false,
    repeatMode: 'off' as const,
    onPlayPause: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onShuffleToggle: jest.fn(),
    onRepeatToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado básico', () => {
    it('debería renderizar correctamente con valores por defecto', () => {
      render(<PlayerControls {...defaultProps} />);

      expect(screen.getByTestId('shuffle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('skip-previous-icon')).toBeInTheDocument();
      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      expect(screen.getByTestId('skip-next-icon')).toBeInTheDocument();
      expect(screen.getByTestId('repeat-icon')).toBeInTheDocument();
    });

    it('debería mostrar icono de Pause cuando está reproduciendo', () => {
      render(<PlayerControls {...defaultProps} isPlaying={true} />);

      expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    });

    it('debería aplicar color primario cuando shuffle está activo', () => {
      render(<PlayerControls {...defaultProps} shuffle={true} />);

      const shuffleButton = screen.getByTestId('shuffle-icon').closest('button');
      expect(shuffleButton).toHaveStyle({ color: expect.any(String) });
    });

    it('debería aplicar color primario cuando repeatMode no es off', () => {
      render(<PlayerControls {...defaultProps} repeatMode="all" />);

      const repeatButton = screen.getByTestId('repeat-icon').closest('button');
      expect(repeatButton).toHaveStyle({ color: expect.any(String) });
    });
  });

  describe('interacciones', () => {
    it('debería llamar onPlayPause cuando se hace click en el botón de play', () => {
      render(<PlayerControls {...defaultProps} />);

      const playButton = screen.getByTestId('play-icon').closest('button');
      fireEvent.click(playButton);

      expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1);
    });

    it('debería llamar onNext cuando se hace click en el botón de siguiente', () => {
      render(<PlayerControls {...defaultProps} />);

      const nextButton = screen.getByTestId('skip-next-icon').closest('button');
      fireEvent.click(nextButton);

      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it('debería llamar onPrevious cuando se hace click en el botón de anterior', () => {
      render(<PlayerControls {...defaultProps} />);

      const previousButton = screen.getByTestId('skip-previous-icon').closest('button');
      fireEvent.click(previousButton);

      expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
    });

    it('debería llamar onShuffleToggle cuando se hace click en el botón de shuffle', () => {
      render(<PlayerControls {...defaultProps} />);

      const shuffleButton = screen.getByTestId('shuffle-icon').closest('button');
      fireEvent.click(shuffleButton);

      expect(defaultProps.onShuffleToggle).toHaveBeenCalledTimes(1);
    });

    it('debería llamar onRepeatToggle cuando se hace click en el botón de repeat', () => {
      render(<PlayerControls {...defaultProps} />);

      const repeatButton = screen.getByTestId('repeat-icon').closest('button');
      fireEvent.click(repeatButton);

      expect(defaultProps.onRepeatToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('tooltips', () => {
    it('debería mostrar tooltip de "Aleatorio"', () => {
      render(<PlayerControls {...defaultProps} />);

      const shuffleButton = screen.getByTestId('shuffle-icon').closest('button');
      expect(shuffleButton).toHaveAttribute('title', 'Aleatorio');
    });

    it('debería mostrar tooltip de "Reproducir"', () => {
      render(<PlayerControls {...defaultProps} isPlaying={false} />);

      const playButton = screen.getByTestId('play-icon').closest('button');
      expect(playButton).toHaveAttribute('title', 'Reproducir');
    });

    it('debería mostrar tooltip de "Pausar" cuando está reproduciendo', () => {
      render(<PlayerControls {...defaultProps} isPlaying={true} />);

      const pauseButton = screen.getByTestId('pause-icon').closest('button');
      expect(pauseButton).toHaveAttribute('title', 'Reproducir');
    });

    it('debería mostrar tooltip de "Repetir una" cuando repeatMode es one', () => {
      render(<PlayerControls {...defaultProps} repeatMode="one" />);

      const repeatButton = screen.getByTestId('repeat-one-icon').closest('button');
      expect(repeatButton).toHaveAttribute('title', 'Repetir una');
    });
  });

  describe('props opcionales', () => {
    it('debería usar valores por defecto cuando no se proporcionan props', () => {
      render(<PlayerControls />);

      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      expect(screen.getByTestId('shuffle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('repeat-icon')).toBeInTheDocument();
    });

    it('debería renderizar con repeatMode "all"', () => {
      render(<PlayerControls {...defaultProps} repeatMode="all" />);

      expect(screen.getByTestId('repeat-icon')).toBeInTheDocument();
    });

    it('debería renderizar con repeatMode "one"', () => {
      render(<PlayerControls {...defaultProps} repeatMode="one" />);

      expect(screen.getByTestId('repeat-one-icon')).toBeInTheDocument();
    });
  });
});
