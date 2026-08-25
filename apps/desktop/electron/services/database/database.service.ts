/**
 * Servicio de Base de Datos SQLite
 * Maneja la conexión, esquema, índices, triggers y operaciones CRUD
 */

import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type {
    Album,
    AlbumWithDetails,
    Artist,
    ArtistWithDetails,
    Genre,
    Library,
    LibraryStats,
    PlaybackHistory,
    Playlist,
    PlayQueueItem,
    Track,
    TrackFilter,
    TrackWithDetails
} from './types';

class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(app.getPath('userData'), 'musicplayer.db');
  }

  /**
   * Inicializar la base de datos y crear todas las tablas
   */
  initialize(): void {
    if (this.db) {
      return;
    }

    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
    this.createIndices();
    this.createTriggers();
  }

  /**
   * Crear todas las tablas del esquema
   */
  private createTables(): void {
    const schema = `
      -- Configuración de la aplicación
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tablas de metadatos de música
      CREATE TABLE IF NOT EXISTS artists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image_path TEXT,
        bio TEXT,
        genres TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name)
      );

      CREATE TABLE IF NOT EXISTS albums (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        artist_id TEXT,
        release_year INTEGER,
        cover_path TEXT,
        genre TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artist_id) REFERENCES artists(id),
        UNIQUE(name, artist_id)
      );

      CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist_id TEXT,
        album_id TEXT,
        file_path TEXT NOT NULL,
        duration INTEGER NOT NULL,
        track_number INTEGER,
        disc_number INTEGER,
        file_size INTEGER,
        bitrate INTEGER,
        sample_rate INTEGER,
        format TEXT,
        genre TEXT,
        year INTEGER,
        date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_played DATETIME,
        play_count INTEGER DEFAULT 0,
        is_favorite INTEGER DEFAULT 0,
        lyrics TEXT,
        file_hash TEXT,
        is_deleted INTEGER DEFAULT 0,
        FOREIGN KEY (artist_id) REFERENCES artists(id),
        FOREIGN KEY (album_id) REFERENCES albums(id)
      );

      CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        track_count INTEGER DEFAULT 0
      );

      -- Playlists
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        cover_path TEXT,
        is_smart INTEGER DEFAULT 0,
        is_system INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sort_order TEXT DEFAULT 'custom'
      );

      CREATE TABLE IF NOT EXISTS playlist_tracks (
        playlist_id TEXT NOT NULL,
        track_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (playlist_id, track_id),
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
      );

      -- Historial de reproducción
      CREATE TABLE IF NOT EXISTS playback_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id TEXT NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0,
        FOREIGN KEY (track_id) REFERENCES tracks(id)
      );

      CREATE TABLE IF NOT EXISTS recently_played (
        track_id TEXT PRIMARY KEY,
        last_played DATETIME DEFAULT CURRENT_TIMESTAMP,
        play_count INTEGER DEFAULT 0,
        FOREIGN KEY (track_id) REFERENCES tracks(id)
      );

      -- Bibliotecas/carpetas monitoreadas
      CREATE TABLE IF NOT EXISTS libraries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        scan_depth INTEGER DEFAULT -1,
        file_types TEXT DEFAULT 'mp3,wav,flac,aac,ogg,m4a',
        is_active INTEGER DEFAULT 1,
        last_scan DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS excluded_paths (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE
      );

      -- Cola de reproducción
      CREATE TABLE IF NOT EXISTS play_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        source_type TEXT,
        source_id TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (track_id) REFERENCES tracks(id)
      );
    `;

    this.db!.exec(schema);
  }

  /**
   * Crear índices para optimizar consultas
   */
  private createIndices(): void {
    const indices = `
      CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_id);
      CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album_id);
      CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
      CREATE INDEX IF NOT EXISTS idx_tracks_favorite ON tracks(is_favorite);
      CREATE INDEX IF NOT EXISTS idx_tracks_date_added ON tracks(date_added);
      CREATE INDEX IF NOT EXISTS idx_tracks_last_played ON tracks(last_played);
      CREATE INDEX IF NOT EXISTS idx_tracks_file_path ON tracks(file_path);
      CREATE INDEX IF NOT EXISTS idx_tracks_file_hash ON tracks(file_hash);
      CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
      CREATE INDEX IF NOT EXISTS idx_playback_history_track ON playback_history(track_id);
      CREATE INDEX IF NOT EXISTS idx_recently_played ON recently_played(last_played DESC);
      CREATE INDEX IF NOT EXISTS idx_albums_artist ON albums(artist_id);
      CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
    `;

    this.db!.exec(indices);
  }

  /**
   * Crear triggers para sincronización automática
   */
  private createTriggers(): void {
    const triggers = `
      -- Trigger para actualizar fecha de modificación
      CREATE TRIGGER IF NOT EXISTS update_artists_modify
      AFTER UPDATE ON artists
      BEGIN
        UPDATE artists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      CREATE TRIGGER IF NOT EXISTS update_albums_modify
      AFTER UPDATE ON albums
      BEGIN
        UPDATE albums SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      CREATE TRIGGER IF NOT EXISTS update_playlists_modify
      AFTER UPDATE ON playlists
      BEGIN
        UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;

      -- Trigger para actualizar play_count en recently_played
      CREATE TRIGGER IF NOT EXISTS update_recently_played_playcount
      AFTER UPDATE ON recently_played
      BEGIN
        UPDATE recently_played SET play_count = play_count + 1 WHERE track_id = NEW.track_id;
      END;
    `;

    this.db!.exec(triggers);
  }

  // ==================== ARTISTAS ====================

  addArtist(artist: Omit<Artist, 'id' | 'created_at' | 'updated_at'>): Artist {
    const id = uuidv4();
    const stmt = this.db!.prepare(`
      INSERT INTO artists (id, name, image_path, bio, genres)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, artist.name, artist.image_path, artist.bio, artist.genres);
    return this.getArtistById(id)!;
  }

  getArtistById(id: string): Artist | null {
    const stmt = this.db!.prepare('SELECT * FROM artists WHERE id = ?');
    return stmt.get(id) as Artist | null;
  }

  getArtistByName(name: string): Artist | null {
    const stmt = this.db!.prepare('SELECT * FROM artists WHERE name = ?');
    return stmt.get(name) as Artist | null;
  }

  getAllArtists(): ArtistWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        a.*,
        COUNT(DISTINCT t.id) as track_count,
        COUNT(DISTINCT al.id) as album_count
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
      LEFT JOIN albums al ON al.artist_id = a.id
      GROUP BY a.id
      ORDER BY a.name ASC
    `);
    return stmt.all() as ArtistWithDetails[];
  }

  updateArtist(id: string, data: Partial<Artist>): Artist | null {
    const fields: string[] = [];
    const values: (string | number | undefined)[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.getArtistById(id);
    
    values.push(id);
    const stmt = this.db!.prepare(`
      UPDATE artists SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getArtistById(id);
  }

  deleteArtist(id: string): boolean {
    const stmt = this.db!.prepare('DELETE FROM artists WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // ==================== ÁLBUMES ====================

  addAlbum(album: Omit<Album, 'id' | 'created_at' | 'updated_at'>): Album {
    const id = uuidv4();
    const stmt = this.db!.prepare(`
      INSERT INTO albums (id, name, artist_id, release_year, cover_path, genre)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, album.name, album.artist_id, album.release_year, album.cover_path, album.genre);
    return this.getAlbumById(id)!;
  }

  getAlbumById(id: string): Album | null {
    const stmt = this.db!.prepare('SELECT * FROM albums WHERE id = ?');
    return stmt.get(id) as Album | null;
  }

  getAlbumByTitleAndArtist(name: string, artist_id?: string): Album | null {
    if (artist_id) {
      const stmt = this.db!.prepare('SELECT * FROM albums WHERE name = ? AND artist_id = ?');
      return stmt.get(name, artist_id) as Album | null;
    }
    const stmt = this.db!.prepare('SELECT * FROM albums WHERE name = ?');
    return stmt.get(name) as Album | null;
  }

  getAllAlbums(): AlbumWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        al.*,
        a.name as artist_name,
        COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN artists a ON a.id = al.artist_id
      LEFT JOIN tracks t ON t.album_id = al.id
      GROUP BY al.id
      ORDER BY al.name ASC
    `);
    return stmt.all() as AlbumWithDetails[];
  }

  getAlbumsByArtist(artist_id: string): AlbumWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        al.*,
        a.name as artist_name,
        COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN artists a ON a.id = al.artist_id
      LEFT JOIN tracks t ON t.album_id = al.id
      WHERE al.artist_id = ?
      GROUP BY al.id
      ORDER BY al.release_year DESC, al.name ASC
    `);
    return stmt.all(artist_id) as AlbumWithDetails[];
  }

  updateAlbum(id: string, data: Partial<Album>): Album | null {
    const fields: string[] = [];
    const values: (string | number | undefined)[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.getAlbumById(id);
    
    values.push(id);
    const stmt = this.db!.prepare(`
      UPDATE albums SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getAlbumById(id);
  }

  deleteAlbum(id: string): boolean {
    const stmt = this.db!.prepare('DELETE FROM albums WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // ==================== CANCIONES ====================

  addTrack(track: Omit<Track, 'id' | 'date_added'>): Track {
    const id = uuidv4();
    const stmt = this.db!.prepare(`
      INSERT INTO tracks (
        id, title, artist_id, album_id, file_path, duration,
        track_number, disc_number, file_size, bitrate, sample_rate,
        format, genre, year, play_count, is_favorite, lyrics, file_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, track.title, track.artist_id, track.album_id, track.file_path, track.duration,
      track.track_number, track.disc_number, track.file_size, track.bitrate, track.sample_rate,
      track.format, track.genre, track.year, track.play_count, track.is_favorite, track.lyrics, track.file_hash
    );
    return this.getTrackById(id)!;
  }

  getTrackById(id: string): Track | null {
    const stmt = this.db!.prepare('SELECT * FROM tracks WHERE id = ?');
    return stmt.get(id) as Track | null;
  }

  getTrackByPath(file_path: string): Track | null {
    const stmt = this.db!.prepare('SELECT * FROM tracks WHERE file_path = ? AND is_deleted = 0');
    return stmt.get(file_path) as Track | null;
  }

  getTrackByHash(file_hash: string): Track | null {
    const stmt = this.db!.prepare('SELECT * FROM tracks WHERE file_hash = ? AND is_deleted = 0');
    return stmt.get(file_hash) as Track | null;
  }

  getAllTracks(filter?: TrackFilter): { tracks: TrackWithDetails[]; total: number } {
    let where = 'WHERE t.is_deleted = 0';
    const params: (string | number)[] = [];

    if (filter?.artist_id) {
      where += ' AND t.artist_id = ?';
      params.push(filter.artist_id);
    }

    if (filter?.album_id) {
      where += ' AND t.album_id = ?';
      params.push(filter.album_id);
    }

    if (filter?.genre) {
      where += ' AND t.genre = ?';
      params.push(filter.genre);
    }

    if (filter?.is_favorite !== undefined) {
      where += ' AND t.is_favorite = ?';
      params.push(filter.is_favorite);
    }

    if (filter?.search) {
      where += ' AND (t.title LIKE ? OR a.name LIKE ? OR al.name LIKE ?)';
      const searchTerm = `%${filter.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countStmt = this.db!.prepare(`
      SELECT COUNT(*) as total
      FROM tracks t
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      ${where}
    `);
    const { total } = countStmt.get(...params) as { total: number };

    const orderBy = filter?.order_by || 't.date_added';
    const orderDir = filter?.order_dir || 'DESC';
    const orderClause = `ORDER BY ${orderBy} ${orderDir}`;
    const limit = filter?.limit || 100;
    const offset = filter?.offset || 0;

    const stmt = this.db!.prepare(`
      SELECT 
        t.*,
        a.name as artist_name,
        al.name as album_name,
        al.cover_path as album_cover
      FROM tracks t
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      ${where}
      ${orderClause}
      LIMIT ? OFFSET ?
    `);

    const tracks = stmt.all(...params, limit, offset) as TrackWithDetails[];
    return { tracks, total };
  }

  updateTrack(id: string, data: Partial<Track>): Track | null {
    const fields: string[] = [];
    const values: (string | number | undefined | null)[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'date_added') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.getTrackById(id);
    
    values.push(id);
    const stmt = this.db!.prepare(`
      UPDATE tracks SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getTrackById(id);
  }

  softDeleteTrack(file_path: string): boolean {
    const stmt = this.db!.prepare('UPDATE tracks SET is_deleted = 1 WHERE file_path = ?');
    const result = stmt.run(file_path);
    return result.changes > 0;
  }

  deleteTrack(id: string): boolean {
    const stmt = this.db!.prepare('DELETE FROM tracks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  incrementPlayCount(track_id: string): void {
    const stmt = this.db!.prepare(`
      UPDATE tracks SET play_count = play_count + 1, last_played = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(track_id);
  }

  toggleFavorite(track_id: string): boolean {
    const track = this.getTrackById(track_id);
    if (!track) return false;

    const stmt = this.db!.prepare('UPDATE tracks SET is_favorite = ? WHERE id = ?');
    stmt.run(track.is_favorite ? 0 : 1, track_id);
    return !track.is_favorite;
  }

  getFavoriteTracks(): TrackWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        t.*,
        a.name as artist_name,
        al.name as album_name,
        al.cover_path as album_cover
      FROM tracks t
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      WHERE t.is_favorite = 1 AND t.is_deleted = 0
      ORDER BY t.last_played DESC
    `);
    return stmt.all() as TrackWithDetails[];
  }

  getRecentlyPlayedTracks(limit: number = 20): TrackWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        t.*,
        a.name as artist_name,
        al.name as album_name,
        al.cover_path as album_cover
      FROM tracks t
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      WHERE t.is_deleted = 0
      ORDER BY t.last_played DESC
      LIMIT ?
    `);
    return stmt.all(limit) as TrackWithDetails[];
  }

  // ==================== GÉNEROS ====================

  getAllGenres(): Genre[] {
    const stmt = this.db!.prepare(`
      SELECT g.*, COUNT(t.id) as track_count
      FROM genres g
      LEFT JOIN tracks t ON t.genre = g.name AND t.is_deleted = 0
      GROUP BY g.id
      ORDER BY g.name ASC
    `);
    return stmt.all() as Genre[];
  }

  addGenre(name: string): Genre {
    const stmt = this.db!.prepare('INSERT OR IGNORE INTO genres (name) VALUES (?)');
    stmt.run(name);
    const stmt2 = this.db!.prepare('SELECT * FROM genres WHERE name = ?');
    return stmt2.get(name) as Genre;
  }

  // ==================== BIBLIOTECAS ====================

  addLibrary(library: Omit<Library, 'id' | 'created_at'>): Library {
    const id = uuidv4();
    const stmt = this.db!.prepare(`
      INSERT INTO libraries (id, name, path, scan_depth, file_types, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, library.name, library.path, library.scan_depth, library.file_types, library.is_active);
    return this.getLibraryById(id)!;
  }

  getLibraryById(id: string): Library | null {
    const stmt = this.db!.prepare('SELECT * FROM libraries WHERE id = ?');
    return stmt.get(id) as Library | null;
  }

  getAllLibraries(): Library[] {
    const stmt = this.db!.prepare('SELECT * FROM libraries ORDER BY created_at DESC');
    return stmt.all() as Library[];
  }

  updateLibrary(id: string, data: Partial<Library>): Library | null {
    const fields: string[] = [];
    const values: (string | number | undefined)[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.getLibraryById(id);
    
    values.push(id);
    const stmt = this.db!.prepare(`
      UPDATE libraries SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getLibraryById(id);
  }

  updateLibraryLastScan(id: string): void {
    const stmt = this.db!.prepare('UPDATE libraries SET last_scan = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  }

  deleteLibrary(id: string): boolean {
    const stmt = this.db!.prepare('DELETE FROM libraries WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // ==================== PLAYLISTS ====================

  addPlaylist(playlist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>): Playlist {
    const id = uuidv4();
    const stmt = this.db!.prepare(`
      INSERT INTO playlists (id, name, description, cover_path, is_smart, is_system, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, playlist.name, playlist.description, playlist.cover_path, playlist.is_smart, playlist.is_system, playlist.sort_order);
    return this.getPlaylistById(id)!;
  }

  getPlaylistById(id: string): Playlist | null {
    const stmt = this.db!.prepare('SELECT * FROM playlists WHERE id = ?');
    return stmt.get(id) as Playlist | null;
  }

  getAllPlaylists(): (Playlist & { track_count: number })[] {
    const stmt = this.db!.prepare(`
      SELECT 
        p.*,
        COUNT(pt.track_id) as track_count
      FROM playlists p
      LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    return stmt.all() as (Playlist & { track_count: number })[];
  }

  updatePlaylist(id: string, data: Partial<Playlist>): Playlist | null {
    const fields: string[] = [];
    const values: (string | number | undefined)[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.getPlaylistById(id);
    
    values.push(id);
    const stmt = this.db!.prepare(`
      UPDATE playlists SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getPlaylistById(id);
  }

  deletePlaylist(id: string): boolean {
    const stmt = this.db!.prepare('DELETE FROM playlists WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  addTrackToPlaylist(playlist_id: string, track_id: string, position?: number): void {
    const maxPos = this.db!.prepare('SELECT MAX(position) as max FROM playlist_tracks WHERE playlist_id = ?').get(playlist_id) as { max: number } | undefined;
    const newPos = position ?? (maxPos?.max ?? -1) + 1;

    const stmt = this.db!.prepare(`
      INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position)
      VALUES (?, ?, ?)
    `);
    stmt.run(playlist_id, track_id, newPos);
  }

  removeTrackFromPlaylist(playlist_id: string, track_id: string): void {
    const stmt = this.db!.prepare('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?');
    stmt.run(playlist_id, track_id);
  }

  getPlaylistTracks(playlist_id: string): TrackWithDetails[] {
    const stmt = this.db!.prepare(`
      SELECT 
        t.*,
        a.name as artist_name,
        al.name as album_name,
        al.cover_path as album_cover,
        pt.position,
        pt.added_at
      FROM playlist_tracks pt
      JOIN tracks t ON t.id = pt.track_id
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position ASC
    `);
    return stmt.all(playlist_id) as TrackWithDetails[];
  }

  reorderPlaylistTrack(playlist_id: string, track_id: string, newPosition: number): void {
    const stmt = this.db!.prepare('UPDATE playlist_tracks SET position = ? WHERE playlist_id = ? AND track_id = ?');
    stmt.run(newPosition, playlist_id, track_id);
  }

  // ==================== COLA DE REPRODUCCIÓN ====================

  addToQueue(track_id: string, source_type?: string, source_id?: string): number {
    const maxPos = this.db!.prepare('SELECT MAX(position) as max FROM play_queue').get() as { max: number } | undefined;
    const position = (maxPos?.max ?? -1) + 1;

    const stmt = this.db!.prepare(`
      INSERT INTO play_queue (track_id, position, source_type, source_id)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(track_id, position, source_type, source_id);
    return position;
  }

  getQueue(): PlayQueueItem[] {
    const stmt = this.db!.prepare(`
      SELECT * FROM play_queue ORDER BY position ASC
    `);
    return stmt.all() as PlayQueueItem[];
  }

  clearQueue(): void {
    this.db!.prepare('DELETE FROM play_queue').run();
  }

  removeFromQueue(id: number): void {
    const stmt = this.db!.prepare('DELETE FROM play_queue WHERE id = ?');
    stmt.run(id);
  }

  reorderQueueItem(id: number, newPosition: number): void {
    const item = this.db!.prepare('SELECT * FROM play_queue WHERE id = ?').get(id) as PlayQueueItem | undefined;
    if (!item) return;

    const stmt = this.db!.prepare('UPDATE play_queue SET position = ? WHERE id = ?');
    stmt.run(newPosition, id);
  }

  // ==================== HISTORIAL ====================

  addToPlaybackHistory(track_id: string, completed: number = 0, progress: number = 0): number {
    const stmt = this.db!.prepare(`
      INSERT INTO playback_history (track_id, completed, progress)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(track_id, completed, progress);
    
    const existing = this.db!.prepare('SELECT * FROM recently_played WHERE track_id = ?').get(track_id);
    if (existing) {
      this.db!.prepare('UPDATE recently_played SET last_played = CURRENT_TIMESTAMP WHERE track_id = ?').run(track_id);
    } else {
      this.db!.prepare('INSERT INTO recently_played (track_id, play_count) VALUES (?, 1)').run(track_id);
    }
    
    return result.lastInsertRowid as number;
  }

  getPlaybackHistory(limit: number = 100): (PlaybackHistory & { track: TrackWithDetails })[] {
    const stmt = this.db!.prepare(`
      SELECT 
        h.*,
        t.title as track_title,
        t.file_path,
        a.name as artist_name,
        al.name as album_name
      FROM playback_history h
      JOIN tracks t ON t.id = h.track_id
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      ORDER BY h.started_at DESC
      LIMIT ?
    `);
    return stmt.all(limit) as (PlaybackHistory & { track: TrackWithDetails })[];
  }

  // ==================== EXCLUIDOS ====================

  addExcludedPath(path: string): void {
    const stmt = this.db!.prepare('INSERT OR IGNORE INTO excluded_paths (path) VALUES (?)');
    stmt.run(path);
  }

  removeExcludedPath(path: string): void {
    const stmt = this.db!.prepare('DELETE FROM excluded_paths WHERE path = ?');
    stmt.run(path);
  }

  getExcludedPaths(): string[] {
    const stmt = this.db!.prepare('SELECT path FROM excluded_paths');
    return (stmt.all() as { path: string }[]).map(p => p.path);
  }

  isPathExcluded(path: string): boolean {
    const stmt = this.db!.prepare('SELECT id FROM excluded_paths WHERE ? LIKE path || "%" OR ? = path');
    const result = stmt.get(path, path);
    return !!result;
  }

  // ==================== ESTADÍSTICAS ====================

  getLibraryStats(): LibraryStats {
    const stats = this.db!.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM tracks WHERE is_deleted = 0) as total_tracks,
        (SELECT COUNT(*) FROM artists) as total_artists,
        (SELECT COUNT(*) FROM albums) as total_albums,
        (SELECT COUNT(*) FROM genres) as total_genres,
        (SELECT COUNT(*) FROM playlists) as total_playlists,
        (SELECT COALESCE(SUM(duration), 0) FROM tracks WHERE is_deleted = 0) as total_duration,
        (SELECT COALESCE(SUM(file_size), 0) FROM tracks WHERE is_deleted = 0) as total_size,
        (SELECT MAX(last_scan) FROM libraries) as last_scan
    `).get() as LibraryStats;

    return stats;
  }

  // ==================== BÚSQUEDA ====================

  search(query: string): { tracks: TrackWithDetails[]; artists: ArtistWithDetails[]; albums: AlbumWithDetails[] } {
    const searchTerm = `%${query}%`;

    const tracksStmt = this.db!.prepare(`
      SELECT 
        t.*,
        a.name as artist_name,
        al.name as album_name,
        al.cover_path as album_cover
      FROM tracks t
      LEFT JOIN artists a ON a.id = t.artist_id
      LEFT JOIN albums al ON al.id = t.album_id
      WHERE t.is_deleted = 0 AND (
        t.title LIKE ? OR 
        a.name LIKE ? OR 
        al.name LIKE ? OR 
        t.genre LIKE ?
      )
      LIMIT 20
    `);

    const artistsStmt = this.db!.prepare(`
      SELECT 
        a.*,
        COUNT(DISTINCT t.id) as track_count,
        COUNT(DISTINCT al.id) as album_count
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
      LEFT JOIN albums al ON al.artist_id = a.id
      WHERE a.name LIKE ?
      LIMIT 10
    `);

    const albumsStmt = this.db!.prepare(`
      SELECT 
        al.*,
        a.name as artist_name,
        COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN artists a ON a.id = al.artist_id
      LEFT JOIN tracks t ON t.album_id = al.id
      WHERE al.name LIKE ? OR a.name LIKE ?
      LIMIT 10
    `);

    const tracks = tracksStmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as TrackWithDetails[];
    const artists = artistsStmt.all(searchTerm) as ArtistWithDetails[];
    const albums = albumsStmt.all(searchTerm, searchTerm) as AlbumWithDetails[];

    return { tracks, artists, albums };
  }

  // ==================== UTILIDADES ====================

  getAllFilePaths(): string[] {
    const stmt = this.db!.prepare('SELECT file_path FROM tracks WHERE is_deleted = 0');
    return (stmt.all() as { file_path: string }[]).map(t => t.file_path);
  }

  transaction<T>(fn: () => T): T {
    return this.db!.transaction(fn)();
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
