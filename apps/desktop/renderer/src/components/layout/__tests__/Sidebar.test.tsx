import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

jest.mock('@mui/icons-material/ChevronLeft', () => ({ default: () => <span data-testid="chevron-left-icon">Collapse</span> }));
jest.mock('@mui/icons-material/Explore', () => ({ default: () => <span data-testid="explore-icon">Explore</span> }));
jest.mock('@mui/icons-material/Home', () => ({ default: () => <span data-testid="home-icon">Home</span> }));
jest.mock('@mui/icons-material/LibraryMusic', () => ({ default: () => <span data-testid="library-icon">Library</span> }));
jest.mock('@mui/icons-material/Search', () => ({ default: () => <span data-testid="search-icon">Search</span> }));

describe('Sidebar', () => {
  it('renderiza la identidad Chaos Music y estado técnico', () => {
    render(<Sidebar onToggle={jest.fn()} />);
    expect(screen.getByText('Chaos Music')).toBeInTheDocument();
    expect(screen.getByText('CM')).toBeInTheDocument();
    expect(screen.getByText('LOCAL / READY')).toBeInTheDocument();
    expect(screen.getByText(/ANDROID \/ FOUNDATION/)).toBeInTheDocument();
  });

  it('renderiza las cuatro rutas principales', () => {
    render(<Sidebar onToggle={jest.fn()} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Biblioteca')).toBeInTheDocument();

    expect(document.querySelector('[data-path="/"]')).toBeInTheDocument();
    expect(document.querySelector('[data-path="/search"]')).toBeInTheDocument();
    expect(document.querySelector('[data-path="/explore"]')).toBeInTheDocument();
    expect(document.querySelector('[data-path="/library"]')).toBeInTheDocument();
  });

  it('ejecuta onToggle desde el control de colapso', () => {
    const onToggle = jest.fn();
    render(<Sidebar onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('chevron-left-icon').closest('button')!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('mantiene la estructura lateral y sus divisores', () => {
    render(<Sidebar onToggle={jest.fn()} />);
    expect(document.querySelector('aside')).toBeInTheDocument();
    expect(document.querySelectorAll('.MuiDivider-root').length).toBeGreaterThanOrEqual(2);
  });
});
