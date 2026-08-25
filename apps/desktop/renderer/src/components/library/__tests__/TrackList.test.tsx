import { fireEvent, render, screen } from '@testing-library/react';
import TrackList from '../TrackList';

jest.mock('@mui/icons-material/AccessTime', () => ({
  default: () => <span data-testid="access-time-icon">duration</span>,
}));

jest.mock('../TrackItem', () => ({
  default: ({ id, title, index, onClick, onPlay, onAddToQueue, onMore }: any) => (
    <tr data-testid={`track-item-${id}`}>
      <td>{index}</td>
      <td>{title}</td>
      <td><button onClick={onClick}>open-{id}</button></td>
      <td><button onClick={onPlay}>play-{id}</button></td>
      <td><button onClick={onAddToQueue}>queue-{id}</button></td>
      <td><button onClick={onMore}>more-{id}</button></td>
    </tr>
  ),
}));

describe('TrackList', () => {
  const tracks = [
    { id: '1', title: 'Track 1', artist: 'Artist 1', album: 'Album 1', duration: 180, albumId: 'a1' },
    { id: '2', title: 'Track 2', artist: 'Artist 2', album: 'Album 2', duration: 200, albumId: 'a2' },
  ] as any[];

  it('renderiza encabezados y pistas', () => {
    render(<TrackList tracks={tracks} />);
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByTestId('access-time-icon')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-2')).toBeInTheDocument();
  });

  it('permite ocultar los encabezados', () => {
    render(<TrackList tracks={tracks} showHeaders={false} />);
    expect(screen.queryByText('Título')).not.toBeInTheDocument();
  });

  it('entrega la entidad Track a las acciones', () => {
    const onTrackClick = jest.fn();
    const onTrackPlay = jest.fn();
    const onAddToQueue = jest.fn();
    const onMoreClick = jest.fn();
    render(
      <TrackList
        tracks={tracks}
        onTrackClick={onTrackClick}
        onTrackPlay={onTrackPlay}
        onAddToQueue={onAddToQueue}
        onMoreClick={onMoreClick}
      />,
    );

    fireEvent.click(screen.getByText('open-1'));
    fireEvent.click(screen.getByText('play-1'));
    fireEvent.click(screen.getByText('queue-1'));
    fireEvent.click(screen.getByText('more-1'));

    expect(onTrackClick).toHaveBeenCalledWith(tracks[0]);
    expect(onTrackPlay).toHaveBeenCalledWith(tracks[0]);
    expect(onAddToQueue).toHaveBeenCalledWith(tracks[0]);
    expect(onMoreClick).toHaveBeenCalledWith(tracks[0]);
  });

  it('acepta una biblioteca vacía', () => {
    render(<TrackList tracks={[]} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByTestId('track-item-1')).not.toBeInTheDocument();
  });
});
