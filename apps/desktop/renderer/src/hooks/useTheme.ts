import { useCallback, useEffect } from 'react';
import type { ThemeMode } from '../../../shared/types';
import { ipcService } from '../services/ipc.service';
import { useAppDispatch, useAppSelector } from '../store';
import { setTheme } from '../store/slices/ui.slice';

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', newTheme);
    }
  }, []);

  const setThemeMode = useCallback((newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
    applyTheme(newTheme);
    
    // Persist theme preference
    ipcService.setSettings({ theme: newTheme });
  }, [dispatch, applyTheme]);

  const toggleThemeMode = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
  }, [theme, setThemeMode]);

  const initTheme = useCallback(async () => {
    try {
      const response = await ipcService.getSettings();
      if (response.success && response.data?.theme) {
        dispatch(setTheme(response.data.theme));
        applyTheme(response.data.theme);
      } else {
        applyTheme(theme);
      }
    } catch (err) {
      console.error('Failed to load theme settings:', err);
      applyTheme(theme);
    }
  }, [dispatch, applyTheme, theme]);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(theme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme: setThemeMode,
    toggleTheme: toggleThemeMode,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}
