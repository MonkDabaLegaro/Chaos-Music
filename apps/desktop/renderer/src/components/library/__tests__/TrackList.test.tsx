/**
 * Pruebas Unitarias para TrackList Component
 */

import { fireEvent, render, screen } from '@testing-library/react';
import TrackList from '../components/library/TrackList';

// Mock de iconos de Material UI
jest.mock('@mui/icons-material/AccessTime', () => ({
  default: () => <span data-testid="access-time-icon">AccessTime</span>,
}));

jest.mock('./TrackItem', () => ({
  default: ({ id, title, index, onClick, onPlay, onMore }: any) => (
    <tr data-testid={`track-item-${id}`} onClick={onClick} onPlay={onPlay} onMore={onMore}>
      <td>{index}</td>
      <td>{title}</td>
    </tr>
  ),
}));

describe('TrackList Component', () => {
  const defaultTracks = [
    { id: '1', title: 'Track 1', artist: 'Artist 1', album: 'Album 1', duration: 180, albumId: 'a1' },
    { id: '2', title: 'Track 2', artist: 'Artist 2', album: 'Album 2', duration: 200, albumId: 'a2' },
    { id: '3', title: 'Track 3', artist: 'Artist 1', album: 'Album 1', duration: 220, albumId: 'a1' },
  ];

  const defaultProps = {
    tracks: defaultTracks,
    showHeaders: true,
    showAlbum: true,
    showDateAdded: true,
    showDuration: true,
    onTrackClick: jest.fn(),
    onTrackPlay: jest.fn(),
    onMoreClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado básico', () => {
    it('debería renderizar correctamente con valores por defecto', () => {
      render(<TrackList {...defaultProps} />);

      expect(screen.getByTestId('access-time-icon')).toBeInTheDocument();
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Álbum')).toBeInTheDocument();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
    });

    it('debería renderizar las canciones', () => {
      render(<TrackList {...defaultProps} />);

      expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('track-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('track-item-3')).toBeInTheDocument();
    });

    it('debería renderizar correctamente con canciones vacías', () => {
      render(<TrackList {...defaultProps} tracks={[]} />);

      expect(screen.queryByTestId('track-item-1')).not.toBeInTheDocument();
    });
  });

  describe('encabezados personalizados', () => {
    it('debería usar encabezados personalizados', () => {
      const customHeaders = ['#', 'Canción', 'Artista', 'Duración'];
      render(<TrackList {...defaultProps} headers={customHeaders} />);

      expect(screen.getByText('Canción')).toBeInTheDocument();
      expect(screen.getByText('Artista')).toBeInTheDocument();
      expect(screen.getByText('Duración')).toBeInTheDocument();
    });

    it('debería ocultar encabezados cuando showHeaders es false', () => {
      render(<TrackList {...defaultProps} showHeaders={false} />);

      expect(screen.queryByText('#')).not.toBeInTheDocument();
      expect(screen.queryByText('Título')).not.toBeInTheDocument();
    });
  });

  describe('opciones de visualización', () => {
    it('debería ocultar álbum cuando showAlbum es false', () => {
      render(<TrackList {...defaultProps} showAlbum={false} />);

      const headers = screen.getByRole('table').querySelectorAll('th');
      const albumHeader = Array.from(headers).find((h) => h.textContent === 'Álbum');
      expect(albumHeader).toBeUndefined();
    });

    it('debería ocultar fecha cuando showDateAdded es false', () => {
      render(<TrackList {...defaultProps} showDateAdded={false} />);

      const headers = screen.getByRole('table').querySelectorAll('th');
      const dateHeader = Array.from(headers).find((h) => h.textContent === 'Fecha');
      expect(dateHeader).toBeUndefined();
    });

    it('debería ocultar duración cuando showDuration es false', () => {
      render(<TrackList {...defaultProps} showDuration={false} />);

      expect(screen.queryByTestId('access-time-icon')).not.toBeInTheDocument();
    });
  });

  describe('interacciones', () => {
    it('debería llamar onTrackClick cuando se hace click en una canción', () => {
      render(<TrackList {...defaultProps} />);

      const trackItem = screen.getByTestId('track-item-1');
      fireEvent.click(trackItem);

      expect(defaultProps.onTrackClick).toHaveBeenCalledWith('1');
    });

    it('debería llamar onTrackPlay cuando se hace click en play', () => {
      render(<TrackList {...defaultProps} />);

      const trackItem = screen.getByTestId('track-item-1');
      // Simular click en el botón de play interno
      fireEvent(trackItem, new CustomEvent('onPlay'));

      expect(defaultProps.onTrackPlay).toHaveBeenCalledWith('1');
    });

    it('debería llamar onMoreClick cuando se hace click en más opciones', () => {
      render(<TrackList {...defaultProps} />);

      const trackItem = screen.getByTestId('track-item-1');
      // Simular click en el botón de más opciones interno
      fireEvent(trackItem, new CustomEvent('onMore'));

      expect(defaultProps.onMoreClick).toHaveBeenCalledWith('1');
    });
  });

  describe('índices de canciones', () => {
    it('debería mostrar el índice correcto para cada canción', () => {
      render(<TrackList {...defaultProps} />);

      const trackItems = screen.getAllByRole('row');
      // El primer row es el header
      expect(trackItems[1]).toHaveTextContent('1');
      expect(trackItems[2]).toHaveTextContent('2');
      expect(trackItems[3]).toHaveTextContent('3');
    });
  });

  describe('tabla', () => {
    it('debería renderizar un elemento table', () => {
      render(<TrackList {...defaultProps} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('debería renderizar table head', () => {
      render(<TrackList {...defaultProps} />);

      expect(screen.getByRole('table')).toContainElement(screen.getByRole('rowgroup'));
    });

    it('debería renderizar table body', () => {
      render(<TrackList {...defaultProps} />);

      expect(screen.getByRole('table')).toContainElement(screen.getAllByRole('rowgroup')[1]);
    });
  });

  describe('valores por defecto', () => {
    it('debería usar valores por defecto para tracks', () => {
      render(<TrackList />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('debería usar encabezados por defecto', () => {
      render(<TrackList />);

      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Álbum')).toBeInTheDocument();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByTestId('access-time-icon')).toBeInTheDocument();
    });
  });
});
