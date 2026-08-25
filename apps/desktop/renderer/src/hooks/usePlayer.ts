import { useCallback } from 'react';
import type { PlayerState, Track } from '../../../shared/types';
import { playerService } from '../services/player.service';
import { useAppDispatch, useAppSelector } from '../store';
import { playNext, playPrevious, setCurrentTrack, setIsPlaying, setPosition, setQueue, setRepeatMode, setShuffle, setVolume } from '../store/slices/player.slice';

export function usePlayer() {
  const dispatch = useAppDispatch();
  const playerState = useAppSelector((state) => state.player);

  const play = useCallback(async () => {
    try {
      await playerService.play();
      dispatch(setIsPlaying(true));
    } catch (err) {
      console.error('Failed to play:', err);
    }
  }, [dispatch]);

  const pause = useCallback(async () => {
    try {
      await playerService.pause();
      dispatch(setIsPlaying(false));
    } catch (err) {
      console.error('Failed to pause:', err);
    }
  }, [dispatch]);

  const stop = useCallback(async () => {
    try {
      await playerService.stop();
      dispatch(setIsPlaying(false));
      dispatch(setCurrentTrack(null));
    } catch (err) {
      console.error('Failed to stop:', err);
    }
  }, [dispatch]);

  const togglePlayPause = useCallback(async () => {
    try {
      await playerService.togglePlayPause();
      const state = await playerService.getState();
      dispatch(setIsPlaying(state.isPlaying));
    } catch (err) {
      console.error('Failed to toggle play/pause:', err);
    }
  }, [dispatch]);

  const next = useCallback(async () => {
    try {
      await playerService.next();
      dispatch(playNext());
    } catch (err) {
      console.error('Failed to play next:', err);
    }
  }, [dispatch]);

  const previous = useCallback(async () => {
    try {
      await playerService.previous();
      dispatch(playPrevious());
    } catch (err) {
      console.error('Failed to play previous:', err);
    }
  }, [dispatch]);

  const seek = useCallback(async (position: number) => {
    try {
      await playerService.seek(position);
      dispatch(setPosition(position));
    } catch (err) {
      console.error('Failed to seek:', err);
    }
  }, [dispatch]);

  const setVolumeLevel = useCallback(async (volume: number) => {
    try {
      await playerService.setVolume(volume);
      dispatch(setVolume(volume));
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  }, [dispatch]);

  const setRepeat = useCallback(async (mode: 'off' | 'all' | 'one') => {
    try {
      await playerService.setRepeat(mode);
      dispatch(setRepeatMode(mode));
    } catch (err) {
      console.error('Failed to set repeat:', err);
    }
  }, [dispatch]);

  const toggleShuffle = useCallback(async () => {
    try {
      const newShuffle = !playerState.shuffle;
      await playerService.setShuffle(newShuffle);
      dispatch(setShuffle(newShuffle));
    } catch (err) {
      console.error('Failed to toggle shuffle:', err);
    }
  }, [dispatch, playerState.shuffle]);

  const playTrack = useCallback(async (track: Track) => {
    try {
      await playerService.playTrack(track);
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    } catch (err) {
      console.error('Failed to play track:', err);
    }
  }, [dispatch]);

  const playTracks = useCallback(async (tracks: Track[], startIndex = 0) => {
    try {
      await playerService.playTracks(tracks, startIndex);
      dispatch(setQueue(tracks));
      dispatch(setCurrentTrack(tracks[startIndex]));
      dispatch(setIsPlaying(true));
    } catch (err) {
      console.error('Failed to play tracks:', err);
    }
  }, [dispatch]);

  const getState = useCallback(async (): Promise<PlayerState> => {
    try {
      return await playerService.getState();
    } catch (err) {
      console.error('Failed to get player state:', err);
      return playerState;
    }
  }, [playerState]);

  return {
    playerState,
    play,
    pause,
    stop,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume: setVolumeLevel,
    setRepeat,
    toggleShuffle,
    playTrack,
    playTracks,
    getState,
  };
}
