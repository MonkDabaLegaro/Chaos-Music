# Guía de Configuración

Esta guía describe todas las opciones de configuración disponibles en MusicPlayer.

## 📁 Configuración de Carpetas de Música

### Añadir Carpetas a la Biblioteca

1. Abre **Preferencias** → **Biblioteca**
2. Haz clic en **Añadir carpeta**
3. Selecciona la carpeta que contiene tu música
4. Haz clic en **Aceptar** para confirmar

### Formatos de Audio Soportados

MusicPlayer soporta los siguientes formatos de audio:

| Formato | Extensión | Soporte |
|---------|-----------|---------|
| MP3 | `.mp3` | ✅ Completo |
| FLAC | `.flac` | ✅ Completo |
| M4A (AAC) | `.m4a` | ✅ Completo |
| WAV | `.wav` | ✅ Completo |
| OGG | `.ogg` | ✅ Completo |
| AAC | `.aac` | ✅ Completo |
| WMA | `.wma` | ✅ Completo |

### Eliminar Carpetas de la Biblioteca

1. Ve a **Preferencias** → **Biblioteca**
2. Selecciona la carpeta que deseas eliminar
3. Haz clic en **Eliminar**
4. Confirma la acción

> **Nota:** Eliminar una carpeta de la biblioteca no elimina los archivos de audio, solo deja de escanearlos.

### Re-escanear la Biblioteca

```bash
# Desde la interfaz
Preferencias → Biblioteca → Re-escanear

# O usa el atajo de teclado
Ctrl + Shift + S
```

---

## 🎬 Configuración de API de YouTube

### API de YouTube (Opcional)

MusicPlayer puede funcionar sin una clave de API utilizando yt-dlp. Sin embargo, si deseas usar la API oficial de YouTube:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**
4. Crea credenciales (API Key)
5. Copia la clave de API

### Configurar la Clave de API

**Método 1: Variable de entorno**
```bash
export YOUTUBE_API_KEY="tu-api-key-aqui"
```

**Métrodo 2: Archivo de configuración**
```json
// ~/.musicplayer/config.json
{
  "youtube": {
    "apiKey": "tu-api-key-aqui"
  }
}
```

### Opciones de YouTube

| Opción | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `calidadAudio` | Calidad de streaming | `high` |
| `cacheSize` | Tamaño máximo del cache (MB) | 500 |
| `autoPlay` | Reproducción automática | `false` |
| `regionCode` | Código de región para búsquedas | `US` |

---

## 🎛️ Opciones del Reproductor

### Configuración de Audio

| Opción | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `volume` | Volumen inicial (0-100) | 80 |
| `audioOutput` | Dispositivo de salida | Por defecto del sistema |
| `normalizeVolume` | Normalizar volumen entre canciones | `false` |
| `crossfade` | Duración del crossfade (segundos) | 0 |
| `fadeIn` | Duración del fade in (segundos) | 0.5 |
| `fadeOut` | Duración del fade out (segundos) | 0.5 |

### Modos de Reproducción

| Opción | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `repeatMode` | Modo de repetición (`off`, `all`, `one`) | `off` |
| `shuffle` | Modo aleatorio | `false` |
| `gapless` | Reproducción sin pausas | `false` |

### Ecualizador

MusicPlayer incluye un ecualizador de 10 bandas con los siguientes ajustes:

**Frecuencias de las bandas:**
- Banda 1: 60 Hz
- Banda 2: 170 Hz
- Banda 3: 310 Hz
- Banda 4: 600 Hz
- Banda 5: 1 kHz
- Banda 6: 3 kHz
- Banda 7: 6 kHz
- Banda 8: 12 kHz
- Banda 9: 14 kHz
- Banda 10: 16 kHz

**Presets disponibles:**

| Preset | Descripción |
|--------|-------------|
| `Flat` | Respuesta plana |
| `Bass Boost` | Aumenta los bajos |
| `Treble Boost` | Aumenta los agudos |
| `Vocal` | Optimizado para voces |
| `Rock` | Sonido agresivo |
| `Pop` | Sonido brillante |
| `Jazz` | Sonido cálido |
| `Classical` | Sonido orquestal |
| `Hip-Hop` | Bajos pesados |
| `Custom` | Personalizado |

---

## 🎨 Personalización del Tema

### Modos de Tema

MusicPlayer soporta tres modos de tema:

| Modo | Descripción |
|------|-------------|
| `light` | Tema claro |
| `dark` | Tema oscuro |
| `system` | Sigue el tema del sistema |

### Colores del Tema

```json
{
  "theme": {
    "mode": "dark",
    "colors": {
      "primary": "#1db954",
      "secondary": "#1ed760",
      "background": "#121212",
      "surface": "#181818",
      "surfaceVariant": "#282828",
      "onPrimary": "#000000",
      "onSecondary": "#000000",
      "onBackground": "#ffffff",
      "onSurface": "#ffffff",
      "onSurfaceVariant": "#b3b3b3",
      "error": "#f15e6c",
      "onError": "#000000"
    }
  }
}
```

### Tipografía

| Opción | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `fontFamily` | Familia tipográfica principal | Inter, system-ui |
| `fontSize` | Tamaño base de fuente | 14px |
| `fontWeight` | Peso de fuente normal | 400 |

---

## ⌨️ Atajos de Teclado Personalizables

### Atajos por Defecto

| Atajo | Acción |
|-------|--------|
| `Espacio` | Play/Pausa |
| `Enter` | Play |
| `K` | Play/Pausa |
| `←` | Canción anterior |
| `→` | Siguiente canción |
| `↑` | Subir volumen |
| `↓` | Bajar volumen |
| `M` | Silenciar |
| `S` | Detener |
| `L` | Buscar |
| `Q` | Añadir a cola |
| `Ctrl + ←` | Retroceder 10s |
| `Ctrl + →` | Avanzar 10s |
| `Ctrl + ↑` | Subir volumen |
| `Ctrl + ↓` | Bajar volumen |
| `Ctrl + M` | Silenciar |
| `Ctrl + S` | Detener |
| `Ctrl + L` | Buscar |
| `Ctrl + Q` | Añadir a cola |
| `Ctrl + Shift + R` | Aleatorio |
| `Ctrl + Shift + L` | Repetir |
| `Ctrl + Shift + F` | Buscar en cola |
| `F11` | Pantalla completa |
| `Escape` | Cerrar diálogos |

### Personalizar Atajos

Edita el archivo de configuración de atajos:

```json
{
  "keyboard": {
    "shortcuts": [
      {
        "id": "playPause",
        "key": "Space",
        "modifiers": [],
        "action": "player:togglePlay",
        "description": "Play/Pausa"
      },
      {
        "id": "nextTrack",
        "key": "ArrowRight",
        "modifiers": ["ctrl"],
        "action": "player:next",
        "description": "Siguiente canción"
      }
    ]
  }
}
```

### Acciones Disponibles

| Acción | Descripción |
|--------|-------------|
| `player:play` | Reproducir |
| `player:pause` | Pausar |
| `player:resume` | Reanudar |
| `player:stop` | Detener |
| `player:next` | Siguiente canción |
| `player:previous` | Canción anterior |
| `player:togglePlay` | Play/Pausa |
| `player:seekForward` | Avanzar |
| `player:seekBackward` | Retroceder |
| `player:setVolume` | Establecer volumen |
| `player:toggleMute` | Silenciar |
| `player:toggleShuffle` | Aleatorio |
| `player:cycleRepeat` | Cambiar repetición |
| `player:addToQueue` | Añadir a cola |
| `library:scan` | Escanear biblioteca |
| `search:focus` | Enfocar búsqueda |
| `window:minimize` | Minimizar |
| `window:maximize` | Maximizar |
| `window:close` | Cerrar |

---

## 📄 Archivo de Configuración

### Ubicación del Archivo de Configuración

| Sistema Operativo | Ubicación |
|-------------------|-----------|
| Windows | `%APPDATA%\MusicPlayer\config.json` |
| macOS | `~/Library/Application Support/MusicPlayer/config.json` |
| Linux | `~/.config/musicplayer/config.json` |

### Estructura Completa del Archivo de Configuración

```json
{
  "app": {
    "name": "MusicPlayer",
    "version": "1.0.0",
    "language": "es",
    "theme": "dark",
    "startWithSystem": false,
    "minimizeToTray": true,
    "closeToTray": false
  },
  "library": {
    "folders": [
      "/home/usuario/Música",
      "/home/usuario/Descargas/música"
    ],
    "supportedFormats": [".mp3", ".flac", ".m4a", ".wav", ".ogg", ".aac", ".wma"],
    "scanOnStartup": true,
    "autoScan": false,
    "excludedFolders": ["node_modules", ".git", "temp"]
  },
  "player": {
    "volume": 80,
    "audioOutput": "default",
    "normalizeVolume": false,
    "crossfade": 0,
    "fadeIn": 0.5,
    "fadeOut": 0.5,
    "repeatMode": "off",
    "shuffle": false,
    "gapless": false
  },
  "equalizer": {
    "enabled": false,
    "preset": "Flat",
    "bands": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  "youtube": {
    "apiKey": "",
    "quality": "high",
    "cacheSize": 500,
    "autoPlay": false,
    "regionCode": "US"
  },
  "keyboard": {
    "enabled": true,
    "shortcuts": []
  },
  "cache": {
    "enabled": true,
    "maxSize": 500,
    "location": "default"
  },
  "playback": {
    "continueOnStartup": false,
    "rememberQueue": true,
    "playbackRate": 1
  }
}
```

### Regenerar Configuración

Si el archivo de configuración está dañado, puedes regenerarlo:

1. Cierra MusicPlayer completamente
2. Elimina o renombra el archivo de configuración
3. Abre MusicPlayer de nuevo
4. Se creará un nuevo archivo de configuración por defecto

---

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MUSIC_PLAYER_DATA` | Carpeta de datos personalizada | `/opt/musicplayer/data` |
| `MUSIC_PLAYER_CONFIG` | Archivo de configuración personalizado | `/etc/musicplayer.json` |
| `FFMPEG_PATH` | Ruta a ffmpeg | `/usr/bin/ffmpeg` |
| `YT_DLP_PATH` | Ruta a yt-dlp | `/usr/local/bin/yt-dlp` |
| `YOUTUBE_API_KEY` | Clave de API de YouTube | `AIza...` |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `DEBUG` | Habilitar debug | `musicplayer:*` |

### Opciones de Línea de Comandos

```bash
musicplayer [opciones]

Opciones:
  --help            Muestra esta ayuda
  --version         Muestra la versión
  --dev             Ejecutar en modo desarrollo
  --port <puerto>   Puerto del servidor de desarrollo
  --no-sandbox      Ejecutar sin sandbox (Linux)
  --force-device-scale-factor <factor>  Factor de escala forzado
```

### Configuración de Base de Datos

MusicPlayer usa SQLite para almacenar metadatos de la biblioteca.

| Opción | Descripción | Valor por Defecto |
|--------|-------------|-------------------|
| `dbPath` | Ruta de la base de datos | `{data}/musicplayer.db` |
| `cacheSize` | Tamaño de cache de SQLite | -67108864 |
| `journalMode` | Modo de journal | WAL |

---

## 🔄 Copia de Seguridad y Restauración

### Exportar Configuración

```bash
# Copiar archivo de configuración
cp ~/.config/musicplayer/config.json backup-config.json

# Exportar base de datos
cp ~/.config/musicplayer/musicplayer.db backup.db
```

### Restaurar Configuración

```bash
# Restaurar archivo de configuración
cp backup-config.json ~/.config/musicplayer/config.json

# Restaurar base de datos
cp backup.db ~/.config/musicplayer/musicplayer.db
```
