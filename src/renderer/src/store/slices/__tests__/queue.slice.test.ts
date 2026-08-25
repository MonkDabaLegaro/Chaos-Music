/**
 * Pruebas Unitarias para QueueSlice
 */

import queueSlice, {
    addQueueItem,
    addQueueItems,
    clearQueue,
    nextItem,
    previousItem,
    removeQueueItem,
    reorderQueueItems,
    setCurrentIndex,
    setExpanded,
    setQueueItems,
    toggleExpanded,
} from '../queue.slice';

describe('queueSlice', () => {
  const createQueueItem = (id: string, position: number) => ({
    id,
    track: { id: `track-${id}`, title: `Track ${id}`, duration: 180 } as any,
    position,
    addedAt: new Date().toISOString(),
  });

  const initialState = {
    items: [],
    currentIndex: 0,
    isExpanded: false,
  };

  describe('acciones básicas', () => {
    it('debería retornar el estado inicial', () => {
      const state = queueSlice(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    it('debería setear items de la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
      ];
      const state = queueSlice(initialState, setQueueItems(items));
      expect(state.items).toEqual(items);
    });

    it('debería agregar un item a la cola', () => {
      const item = createQueueItem('1', 0);
      const state = queueSlice(initialState, addQueueItem(item));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(item);
    });

    it('debería agregar múltiples items a la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(initialState, addQueueItems(items));
      expect(state.items).toHaveLength(3);
    });

    it('debería remover un item de la cola por ID', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items },
        removeQueueItem('2')
      );
      expect(state.items).toHaveLength(2);
      expect(state.items.find((item) => item.id === '2')).toBeUndefined();
    });

    it('debería ajustar currentIndex al remover un item antes de la posición actual', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 2 },
        removeQueueItem('1')
      );
      expect(state.currentIndex).toBe(1);
    });

    it('no debería ajustar currentIndex al remover un item después de la posición actual', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 1 },
        removeQueueItem('3')
      );
      expect(state.currentIndex).toBe(1);
    });

    it('debería reordenar items en la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items },
        reorderQueueItems({ fromIndex: 0, toIndex: 2 })
      );
      expect(state.items[0].id).toBe('2');
      expect(state.items[2].id).toBe('1');
    });

    it('debería limpiar la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 1 },
        clearQueue()
      );
      expect(state.items).toHaveLength(0);
      expect(state.currentIndex).toBe(0);
    });

    it('debería setear currentIndex', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items },
        setCurrentIndex(2)
      );
      expect(state.currentIndex).toBe(2);
    });

    it('debería limitar currentIndex al tamaño de la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
      ];
      const state = queueSlice(
        { ...initialState, items },
        setCurrentIndex(10)
      );
      expect(state.currentIndex).toBe(1);
    });

    it('debería asegurar que currentIndex no sea negativo', () => {
      const state = queueSlice(initialState, setCurrentIndex(-5));
      expect(state.currentIndex).toBe(0);
    });
  });

  describe('nextItem', () => {
    it('debería avanzar al siguiente item', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 0 },
        nextItem()
      );
      expect(state.currentIndex).toBe(1);
    });

    it('debería hacer loop al inicio de la cola', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 1 },
        nextItem()
      );
      expect(state.currentIndex).toBe(0);
    });

    it('no debería hacer nada si la cola está vacía', () => {
      const state = queueSlice(initialState, nextItem());
      expect(state.currentIndex).toBe(0);
    });
  });

  describe('previousItem', () => {
    it('debería ir al item anterior', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
        createQueueItem('3', 2),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 2 },
        previousItem()
      );
      expect(state.currentIndex).toBe(1);
    });

    it('debería ir al final de la cola cuando está en el inicio', () => {
      const items = [
        createQueueItem('1', 0),
        createQueueItem('2', 1),
      ];
      const state = queueSlice(
        { ...initialState, items, currentIndex: 0 },
        previousItem()
      );
      expect(state.currentIndex).toBe(1);
    });
  });

  describe('setExpanded', () => {
    it('debería setear isExpanded a true', () => {
      const state = queueSlice(initialState, setExpanded(true));
      expect(state.isExpanded).toBe(true);
    });

    it('debería setear isExpanded a false', () => {
      const state = queueSlice(
        { ...initialState, isExpanded: true },
        setExpanded(false)
      );
      expect(state.isExpanded).toBe(false);
    });
  });

  describe('toggleExpanded', () => {
    it('debería alternar isExpanded', () => {
      const state = queueSlice(initialState, toggleExpanded());
      expect(state.isExpanded).toBe(true);
    });

    it('debería alternar isExpanded de true a false', () => {
      const state = queueSlice(
        { ...initialState, isExpanded: true },
        toggleExpanded()
      );
      expect(state.isExpanded).toBe(false);
    });
  });
});
