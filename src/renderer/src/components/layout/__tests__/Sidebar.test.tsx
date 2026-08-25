/**
 * Pruebas Unitarias para Sidebar Component
 */

import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '../components/layout/Sidebar';

// Mock de iconos de Material UI
jest.mock('@mui/icons-material/Add', () => ({
  default: () => <span data-testid="add-icon">Add</span>,
}));

jest.mock('@mui/icons-material/ChevronLeft', () => ({
  default: () => <span data-testid="chevron-left-icon">ChevronLeft</span>,
}));

jest.mock('@mui/icons-material/Explore', () => ({
  default: () => <span data-testid="explore-icon">Explore</span>,
}));

jest.mock('@mui/icons-material/Home', () => ({
  default: () => <span data-testid="home-icon">Home</span>,
}));

jest.mock('@mui/icons-material/LibraryMusic', () => ({
  default: () => <span data-testid="library-music-icon">LibraryMusic</span>,
}));

jest.mock('@mui/icons-material/PlaylistPlay', () => ({
  default: () => <span data-testid="playlist-play-icon">PlaylistPlay</span>,
}));

jest.mock('@mui/icons-material/Search', () => ({
  default: () => <span data-testid="search-icon">Search</span>,
}));

describe('Sidebar Component', () => {
  const defaultProps = {
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderizado básico', () => {
    it('debería renderizar correctamente', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('MusicPlayer')).toBeInTheDocument();
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByTestId('explore-icon')).toBeInTheDocument();
      expect(screen.getByTestId('library-music-icon')).toBeInTheDocument();
    });

    it('debería renderizar el logo', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('debería renderizar el botón de collapse', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });
  });

  describe('navegación principal', () => {
    it('debería renderizar los elementos de navegación', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Buscar')).toBeInTheDocument();
      expect(screen.getByText('Explorar')).toBeInTheDocument();
      expect(screen.getByText('Biblioteca')).toBeInTheDocument();
    });

    it('debería tener los paths correctos', () => {
      render(<Sidebar {...defaultProps} />);

      const menuItems = screen.getAllByRole('listitem');
      expect(menuItems).toHaveLength(4);
    });
  });

  describe('sección de playlists', () => {
    it('debería renderizar el título de playlists', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Playlists')).toBeInTheDocument();
    });

    it('debería renderizar las playlists por defecto', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Mis Mejores Canciones')).toBeInTheDocument();
      expect(screen.getByText('Rock Clásico')).toBeInTheDocument();
      expect(screen.getByText('Jazz & Blues')).toBeInTheDocument();
      expect(screen.getByText('Música Electrónica')).toBeInTheDocument();
    });

    it('debería renderizar el botón de crear playlist', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });
  });

  describe('interacciones', () => {
    it('debería llamar onToggle cuando se hace click en el botón de collapse', () => {
      render(<Sidebar {...defaultProps} />);

      const toggleButton = screen.getByTestId('chevron-left-icon').closest('button');
      fireEvent.click(toggleButton);

      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('debería tener tooltip "Contraer"', () => {
      render(<Sidebar {...defaultProps} />);

      const toggleButton = screen.getByTestId('chevron-left-icon').closest('button');
      expect(toggleButton).toHaveAttribute('title', 'Contraer');
    });
  });

  describe('estructura', () => {
    it('debería tener un layout con dirección de columna', () => {
      render(<Sidebar {...defaultProps} />);

      const sidebar = screen.getByText('MusicPlayer').closest('div');
      expect(sidebar).toHaveStyle({ display: 'flex', flexDirection: 'column' });
    });

    it('debería tener un borde derecho', () => {
      render(<Sidebar {...defaultProps} />);

      const sidebar = screen.getByText('MusicPlayer').closest('div');
      expect(sidebar).toHaveStyle({ borderRight: expect.any(String) });
    });

    it('debería tener altura completa', () => {
      render(<Sidebar {...defaultProps} />);

      const sidebar = screen.getByText('MusicPlayer').closest('div');
      expect(sidebar).toHaveStyle({ height: '100%' });
    });
  });

  describe('divisores', () => {
    it('debería tener divisores entre secciones', () => {
      render(<Sidebar {...defaultProps} />);

      // Verificar que existen divisores (MUI Divider)
      const dividers = document.querySelectorAll('.MuiDivider-root');
      expect(dividers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('tooltips', () => {
    it('debería tener tooltip para crear playlist', () => {
      render(<Sidebar {...defaultProps} />);

      const addButton = screen.getByTestId('add-icon').closest('button');
      expect(addButton).toHaveAttribute('title', 'Crear Playlist');
    });
  });

  describe('tipografía', () => {
    it('debería mostrar "MusicPlayer" como título', () => {
      render(<Sidebar {...defaultProps} />);

      const title = screen.getByText('MusicPlayer');
      expect(title).toBeInTheDocument();
    });

    it('debería mostrar "Playlists" como subtítulo', () => {
      render(<Sidebar {...defaultProps} />);

      const subtitle = screen.getByText('Playlists');
      expect(subtitle).toBeInTheDocument();
    });
  });
});
