import { useCallback, useEffect } from 'react';
import { usePlayer } from './usePlayer';
import { useQueue } from './useQueue';

interface KeyboardShortcut {
  key: string;
  modifiers: Set<string>;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const { togglePlayPause, next, previous, seek, setVolume, toggleShuffle, setRepeat } = usePlayer();
  const { toggleExpandedView } = useQueue();

  const shortcuts: KeyboardShortcut[] = [
    { key: ' ', modifiers: new Set(), action: togglePlayPause, description: 'Play/Pause' },
    { key: 'ArrowRight', modifiers: new Set(), action: () => seek(5), description: 'Seek forward 5s' },
    { key: 'ArrowLeft', modifiers: new Set(), action: () => seek(-5), description: 'Seek backward 5s' },
    { key: 'ArrowRight', modifiers: new Set(['ctrl']), action: next, description: 'Next track' },
    { key: 'ArrowLeft', modifiers: new Set(['ctrl']), action: previous, description: 'Previous track' },
    { key: 'ArrowUp', modifiers: new Set(), action: () => setVolume(0.1), description: 'Volume up' },
    { key: 'ArrowDown', modifiers: new Set(), action: () => setVolume(-0.1), description: 'Volume down' },
    { key: 'm', modifiers: new Set(), action: () => setVolume(0), description: 'Mute' },
    { key: 's', modifiers: new Set(), action: toggleShuffle, description: 'Toggle shuffle' },
    { key: 'r', modifiers: new Set(), action: () => setRepeat('off' as const), description: 'Toggle repeat' },
    { key: 'q', modifiers: new Set(), action: toggleExpandedView, description: 'Toggle queue' },
    { key: 'n', modifiers: new Set(), action: next, description: 'Next track' },
    { key: 'p', modifiers: new Set(), action: previous, description: 'Previous track' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const modifiers = new Set<string>();
    if (event.ctrlKey) modifiers.add('ctrl');
    if (event.shiftKey) modifiers.add('shift');
    if (event.altKey) modifiers.add('alt');
    if (event.metaKey) modifiers.add('meta');

    for (const shortcut of shortcuts) {
      if (event.key.toLowerCase() === shortcut.key.toLowerCase() && 
          shortcut.modifiers.size === modifiers.size &&
          [...shortcut.modifiers].every(mod => modifiers.has(mod))) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}
