/**
 * Servicio de Escáner de Archivos de Audio
 * Escanear carpetas, extraer metadatos y sincronizar con la base de datos
 */

import { app } from 'electron';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { databaseService } from '../database/database.service';
import type {
    FileInfo,
    ProcessedTrack,
    ScanProgress,
    ScanResult,
    ScanStatus,
} from './types';

class FileScannerService {
  private isCancelled: boolean = false;
  private currentStatus: ScanStatus = {
    isScanning: false,
    progress: 0,
    currentPath: '',
    currentFile: '',
    startTime: null,
    result: null,
  };

  private progressCallback: ((progress: ScanProgress) => void) | null = null;

  // Formatos de audio soportados
  private readonly SUPPORTED_FORMATS = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'webm'];

  /**
   * Escanear una biblioteca completa
   */
  async scanLibrary(libraryId: string): Promise<ScanResult> {
    const library = databaseService.getLibraryById(libraryId);
    if (!library) {
      throw new Error(`Biblioteca no encontrada: ${libraryId}`);
    }

    this.isCancelled = false;
    const startTime = Date.now();
    
    this.currentStatus = {
      isScanning: true,
      progress: 0,
      currentPath: library.path,
      currentFile: '',
      startTime,
      result: null,
    };

    const result: ScanResult = {
      totalFiles: 0,
      scannedFiles: 0,
      addedTracks: 0,
      updatedTracks: 0,
      removedTracks: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Escanear todos los archivos
      const files = await this.walkDirectory(library.path);
      result.totalFiles = files.length;

      // Detectar archivos eliminados
      const existingFiles = databaseService.getAllFilePaths();
      const currentFiles = new Set(files.map(f => f.path));
      const deletedFiles = existingFiles.filter(f => !currentFiles.has(f));

      for (const filePath of deletedFiles) {
        if (this.isCancelled) break;
        databaseService.softDeleteTrack(filePath);
        result.removedTracks++;
      }

      // Escanear archivos nuevos/modificados
      for (const file of files) {
        if (this.isCancelled) break;

        try {
          const trackInfo = await this.processFile(file);

          if (trackInfo) {
            const existingTrack = databaseService.getTrackByPath(file.path);
            
            if (existingTrack) {
              // Verificar si el archivo ha cambiado
              if (existingTrack.file_hash !== trackInfo.file_hash) {
                databaseService.updateTrack(existingTrack.id, trackInfo);
                result.updatedTracks++;
              }
            } else {
              databaseService.addTrack(trackInfo);
              result.addedTracks++;
            }
          }

          result.scannedFiles++;
          
          // Calcular progreso
          const progress: ScanProgress = {
            current: result.scannedFiles,
            total: result.totalFiles,
            currentFile: file.path,
            percentage: Math.round((result.scannedFiles / result.totalFiles) * 100),
          };

          this.currentStatus.progress = progress.percentage;
          this.currentStatus.currentFile = file.path;

          if (this.progressCallback) {
            this.progressCallback(progress);
          }

        } catch (error) {
          result.errors.push({
            file: file.path,
            error: error instanceof Error ? error.message : 'Error desconocido',
          });
        }
      }

      // Actualizar fecha del último escaneo
      databaseService.updateLibraryLastScan(libraryId);

    } catch (error) {
      result.errors.push({
        file: library.path,
        error: error instanceof Error ? error.message : 'Error fatal durante el escaneo',
      });
    }

    result.duration = Date.now() - startTime;
    
    this.currentStatus = {
      isScanning: false,
      progress: 100,
      currentPath: library.path,
      currentFile: '',
      startTime: this.currentStatus.startTime,
      result,
    };

    return result;
  }

  /**
   * Procesar un archivo individual
   */
  private async processFile(file: FileInfo): Promise<Parameters<typeof databaseService.addTrack>[0] | null> {
    try {
      // Generar hash del archivo
      const fileHash = await this.generateFileHash(file.path);

      return {
        title: path.basename(file.path, path.extname(file.path)),
        file_path: file.path,
        duration: 0,
        file_size: file.size,
        format: file.extension.toUpperCase(),
        play_count: 0,
        is_favorite: 0,
        file_hash: fileHash,
      };
    } catch (error) {
      console.error(`Error procesando archivo ${file.path}:`, error);
      return null;
    }
  }

  /**
   * Escanear directorio recursivamente
   */
  private async walkDirectory(dir: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];
    const excludedPaths = databaseService.getExcludedPaths();

    const walk = async (currentDir: string): Promise<void> => {
      if (this.isCancelled) return;

      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (this.isCancelled) break;

        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(dir, fullPath);

        // Verificar exclusión
        const isExcluded = excludedPaths.some(ep => 
          relativePath.startsWith(ep) || fullPath.startsWith(ep)
        );

        if (isExcluded) continue;

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase().slice(1);
          if (this.SUPPORTED_FORMATS.includes(ext)) {
            const stat = await fs.stat(fullPath);
            files.push({
              path: fullPath,
              mtime: stat.mtime,
              size: stat.size,
              extension: ext,
            });
          }
        }
      }
    };

    await walk(dir);
    return files;
  }

  /**
   * Generar hash del archivo para detectar cambios
   */
  private async generateFileHash(filePath: string): Promise<string> {
    const fileHandle = await fs.open(filePath, 'r');
    const hash = crypto.createHash('md5');
    const buffer = new Uint8Array(8192);

    try {
      let bytesRead: number;
      do {
        bytesRead = await fileHandle.read(buffer, 0, buffer.length);
        hash.update(buffer.slice(0, bytesRead));
      } while (bytesRead === buffer.length);
    } finally {
      await fileHandle.close();
    }

    return hash.digest('hex');
  }

  /**
   * Guardar portada de álbum
   */
  private async saveCoverArt(albumId: string, coverData: Uint8Array): Promise<string | null> {
    try {
      const coverDir = path.join(app.getPath('userData'), 'covers');
      await fs.mkdir(coverDir, { recursive: true });

      const coverPath = path.join(coverDir, `${albumId}.jpg`);
      await fs.writeFile(coverPath, coverData);
      
      return coverPath;
    } catch (error) {
      console.error('Error guardando portada:', error);
      return null;
    }
  }

  /**
   * Cancelar escaneo en progreso
   */
  cancelScan(): void {
    this.isCancelled = true;
  }

  /**
   * Obtener estado del escaneo
   */
  getScanStatus(): ScanStatus {
    return { ...this.currentStatus };
  }

  /**
   * Configurar callback de progreso
   */
  onProgress(callback: (progress: ScanProgress) => void): void {
    this.progressCallback = callback;
  }

  /**
   * Escanear archivo individual para obtener metadatos básicos
   */
  async scanFile(filePath: string): Promise<ProcessedTrack | null> {
    try {
      const ext = path.extname(filePath).toLowerCase().slice(1);
      if (!this.SUPPORTED_FORMATS.includes(ext)) {
        return null;
      }

      const fileStat = await fs.stat(filePath);
      const fileHash = await this.generateFileHash(filePath);

      return {
        id: uuidv4(),
        title: path.basename(filePath, path.extname(filePath)),
        file_path: filePath,
        duration: 0,
        file_size: fileStat.size,
        format: ext.toUpperCase(),
        file_hash: fileHash,
      };
    } catch {
      return null;
    }
  }
}

export const fileScannerService = new FileScannerService();
