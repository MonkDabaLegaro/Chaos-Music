import { fireEvent, render, screen } from '@testing-library/react';
import PlayerControls from '../PlayerControls';

jest.mock('@mui/icons-material/Pause', () => ({ default: () => <span data-testid="pause-icon">Pause</span> }));
jest.mock('@mui/icons-material/PlayArrow', () => ({ default: () => <span data-testid="play-icon">Play</span> }));
jest.mock('@mui/icons-material/Repeat', () => ({ default: () => <span data-testid="repeat-icon">Repeat</span> }));
jest.mock('@mui/icons-material/RepeatOne', () => ({ default: () => <span data-testid="repeat-one-icon">RepeatOne</span> }));
jest.mock('@mui/icons-material/Shuffle', () => ({ default: () => <span data-testid="shuffle-icon">Shuffle</span> }));
jest.mock('@mui/icons-material/SkipNext', () => ({ default: () => <span data-testid="skip-next-icon">Next</span> }));
jest.mock('@mui/icons-material/SkipPrevious', () => ({ default: () => <span data-testid="skip-previous-icon">Previous</span> }));

describe('PlayerControls', () => {
  const props = {
    onPlayPause: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onShuffleToggle: jest.fn(),
    onRepeatToggle: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('muestra play o pause según el estado', () => {
    const { rerender } = render(<PlayerControls {...props} isPlaying={false} />);
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    rerender(<PlayerControls {...props} isPlaying />);
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
  });

  it('ejecuta las acciones de transporte', () => {
    render(<PlayerControls {...props} />);
    fireEvent.click(screen.getByTestId('play-icon').closest('button')!);
    fireEvent.click(screen.getByTestId('skip-next-icon').closest('button')!);
    fireEvent.click(screen.getByTestId('skip-previous-icon').closest('button')!);
    expect(props.onPlayPause).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
    expect(props.onPrevious).toHaveBeenCalledTimes(1);
  });

  it('ejecuta shuffle y repeat', () => {
    render(<PlayerControls {...props} shuffle repeatMode="all" />);
    fireEvent.click(screen.getByTestId('shuffle-icon').closest('button')!);
    fireEvent.click(screen.getByTestId('repeat-icon').closest('button')!);
    expect(props.onShuffleToggle).toHaveBeenCalledTimes(1);
    expect(props.onRepeatToggle).toHaveBeenCalledTimes(1);
  });

  it('usa el callback legado onSkipNext cuando onNext no existe', () => {
    const onSkipNext = jest.fn();
    render(<PlayerControls onSkipNext={onSkipNext} />);
    fireEvent.click(screen.getByTestId('skip-next-icon').closest('button')!);
    expect(onSkipNext).toHaveBeenCalledTimes(1);
  });

  it('muestra repeat-one cuando corresponde', () => {
    render(<PlayerControls repeatMode="one" />);
    expect(screen.getByTestId('repeat-one-icon')).toBeInTheDocument();
  });
});
