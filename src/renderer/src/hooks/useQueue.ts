import { useCallback } from 'react';
import type { QueueItem, Track } from '../../../shared/types';
import { playerService } from '../services/player.service';
import { useAppDispatch, useAppSelector } from '../store';
import { addQueueItems, clearQueue, nextItem, previousItem, removeQueueItem, reorderQueueItems, setCurrentIndex, setExpanded, toggleExpanded } from '../store/slices/queue.slice';

export function useQueue() {
  const dispatch = useAppDispatch();
  const { items, currentIndex, isExpanded } = useAppSelector((state) => state.queue);

  const currentTrack = items[currentIndex]?.track || null;

  const addToQueue = useCallback(async (tracks: Track | Track[]) => {
    const trackList = Array.isArray(tracks) ? tracks : [tracks];
    const queueItems: QueueItem[] = trackList.map((track, index) => ({
      id: `${track.id}-${Date.now()}-${index}`,
      track,
      position: items.length + index,
      addedAt: new Date().toISOString(),
    }));
    
    dispatch(addQueueItems(queueItems));
    
    try {
      await playerService.addToQueue(trackList.map(t => t.id));
    } catch (err) {
      console.error('Failed to add to queue:', err);
    }
  }, [dispatch, items.length]);

  const removeFromQueue = useCallback(async (itemId: string) => {
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      dispatch(removeQueueItem(itemId));
      
      try {
        await playerService.removeFromQueue(index);
      } catch (err) {
        console.error('Failed to remove from queue:', err);
      }
    }
  }, [dispatch, items]);

  const reorder = useCallback(async (fromIndex: number, toIndex: number) => {
    dispatch(reorderQueueItems({ fromIndex, toIndex }));
    
    try {
      await playerService.reorderQueue(fromIndex, toIndex);
    } catch (err) {
      console.error('Failed to reorder queue:', err);
    }
  }, [dispatch]);

  const clear = useCallback(async () => {
    dispatch(clearQueue());
    
    try {
      await playerService.clearQueue();
    } catch (err) {
      console.error('Failed to clear queue:', err);
    }
  }, [dispatch]);

  const goToIndex = useCallback(async (index: number) => {
    dispatch(setCurrentIndex(index));
  }, [dispatch]);

  const next = useCallback(() => {
    dispatch(nextItem());
  }, [dispatch]);

  const previous = useCallback(() => {
    dispatch(previousItem());
  }, [dispatch]);

  const toggleExpandedView = useCallback(() => {
    dispatch(toggleExpanded());
  }, [dispatch]);

  const setExpandedView = useCallback((expanded: boolean) => {
    dispatch(setExpanded(expanded));
  }, [dispatch]);

  return {
    queueItems: items,
    currentIndex,
    currentTrack,
    isExpanded,
    addToQueue,
    removeFromQueue,
    reorder,
    clear,
    goToIndex,
    next,
    previous,
    toggleExpandedView,
    setExpandedView,
  };
}
