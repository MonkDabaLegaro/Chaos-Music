import { act, renderHook } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { useQueue } from '../hooks/useQueue';
import { playerService } from '../services/player.service';
import playerReducer from '../store/slices/player.slice';
import queueReducer from '../store/slices/queue.slice';

jest.mock('../services/player.service', () => ({
  playerService: {
    addToQueue: jest.fn().mockResolvedValue(undefined),
    removeFromQueue: jest.fn().mockResolvedValue(undefined),
    reorderQueue: jest.fn().mockResolvedValue(undefined),
    clearQueue: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useQueue', () => {
  const setup = () => {
    const store = configureStore({ reducer: { queue: queueReducer, player: playerReducer } });
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
    return { store, ...renderHook(() => useQueue(), { wrapper }) };
  };

  beforeEach(() => jest.clearAllMocks());

  it('expone una cola vacía inicialmente', () => {
    const { result } = setup();
    expect(result.current.queueItems).toEqual([]);
    expect(result.current.currentTrack).toBeNull();
  });

  it('agrega entidades Track tanto al estado como al motor', async () => {
    const track = { id: '1', title: 'Track 1', duration: 180 } as any;
    const { result, store } = setup();

    await act(async () => { await result.current.addToQueue(track); });

    expect(store.getState().queue.items).toHaveLength(1);
    expect(playerService.addToQueue).toHaveBeenCalledWith([track]);
  });

  it('agrega múltiples pistas preservando su orden', async () => {
    const tracks = [
      { id: '1', title: 'Track 1', duration: 180 },
      { id: '2', title: 'Track 2', duration: 200 },
    ] as any[];
    const { result, store } = setup();

    await act(async () => { await result.current.addToQueue(tracks); });

    expect(store.getState().queue.items.map((item: any) => item.track.id)).toEqual(['1', '2']);
    expect(playerService.addToQueue).toHaveBeenCalledWith(tracks);
  });

  it('remueve y reordena items sincronizando el motor', async () => {
    const { result, store } = setup();
    const tracks = [{ id: '1' }, { id: '2' }] as any[];
    await act(async () => { await result.current.addToQueue(tracks); });
    const firstId = store.getState().queue.items[0].id;

    await act(async () => { await result.current.reorder(0, 1); });
    expect(playerService.reorderQueue).toHaveBeenCalledWith(0, 1);

    await act(async () => { await result.current.removeFromQueue(firstId); });
    expect(store.getState().queue.items).toHaveLength(1);
  });

  it('limpia la cola y controla navegación/expansión', async () => {
    const { result, store } = setup();
    await act(async () => { await result.current.addToQueue([{ id: '1' }, { id: '2' }] as any[]); });

    act(() => result.current.goToIndex(1));
    expect(store.getState().queue.currentIndex).toBe(1);
    act(() => result.current.previous());
    expect(store.getState().queue.currentIndex).toBe(0);
    act(() => result.current.toggleExpandedView());
    expect(store.getState().queue.isExpanded).toBe(true);

    await act(async () => { await result.current.clear(); });
    expect(store.getState().queue.items).toHaveLength(0);
    expect(playerService.clearQueue).toHaveBeenCalledTimes(1);
  });
});
