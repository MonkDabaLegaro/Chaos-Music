# MusicPlayer

<div align="center">

![MusicPlayer Logo](docs/assets/logo.png)

**Un reproductor de música moderno similar a Spotify con capacidades de música local y YouTube**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-yellow.svg)](package.json)

</div>

## 📋 Descripción

MusicPlayer es un reproductor de música de escritorio construido con Electron, React y TypeScript. Ofrece una experiencia similar a Spotify pero con soporte completo para tu biblioteca de música local y acceso integrado a YouTube para descubrir y reproducir música adicional.

## ✨ Características Principales

### 🎵 Reproducción de Música Local
- **Escaneo automático de biblioteca**: Añade carpetas y escanea automáticamente tus archivos de música
- **Soporte para múltiples formatos**: MP3, FLAC, M4A, WAV, OGG, AAC, WMA
- **Metadatos completos**: Extrae y muestra información de artistas, álbumes, géneros y más
- **Organización inteligente**: Visualiza tu música por artistas, álbumes, géneros y playlists

### 🎬 Integración con YouTube
- **Búsqueda de videos**: Busca y reproduce música directamente desde YouTube
- **Streaming de audio**: Reproduce audio de videos de YouTube sin necesidad de descargar
- **Listas de reproducción**: Importa y reproduce playlists de YouTube
- **Tendencias y recomendaciones**: Descubre música popular y basada en tus preferencias

### 🎛️ Características Avanzadas
- **Ecualizador de 10 bandas**: Personaliza el sonido a tu gusto
- **Cola de reproducción**: Añade y organiza canciones en cola
- **Modo aleatorio y repetición**: Off, una canción, o todas
- **Atajos de teclado**: Controla la reproducción sin usar el ratón
- **Temas personalizables**: Modo claro, oscuro o automático

### 🖥️ Interfaz Moderna
- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla
- **Navegación intuitiva**: Sidebar, barra de reproducción y controles fáciles de usar
- **Búsqueda global**: Encuentra rápidamente cualquier canción, artista o álbum
- **Notificaciones**: Feedback visual para acciones del usuario

## 🖥️ Capturas de Pantalla

> *Añade capturas de pantalla aquí*

```
┌─────────────────────────────────────────────────────────────────┐
│  MusicPlayer                                                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────┐  🎵 Biblioteca   🔍 Buscar   ▶ Explorar        ⚙️     │
│  │ ☰  ├──────────────────────────────────────────────────────│
│  │     │                                                      │
│  │ 📁 │  📻 Reproduciendo ahora                              │
│  │ 🎤 │  ┌────────────────────────────────────────────────┐  │
│  │ ❤️ │  │  🎵 Canción Actual - Artista                   │  │
│  │ 📋 │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │     │  │  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  │
│  └─────┘  └────────────────────────────────────────────────┘  │
│           [⏮] [▶/⏸] [⏭]    🔊 80%    🔄  🔀    ⏱️ 3:45      │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Requisitos del Sistema

| Componente | Requisito Mínimo | Recomendado |
|------------|------------------|-------------|
| **Sistema Operativo** | Windows 10 / macOS 10.15 / Ubuntu 20.04 | Windows 11 / macOS 12+ / Ubuntu 22.04 |
| **Procesador** | Dual-core 2.0 GHz | Quad-core 3.0 GHz+ |
| **Memoria RAM** | 4 GB | 8 GB+ |
| **Almacenamiento** | 500 MB (aplicación) + espacio para música | SSD + espacio para música |
| **Node.js** | Versión 18.0.0 o superior | Versión 20+ |
| **Dependencias** | ffmpeg, yt-dlp | ffmpeg última versión |

## 📦 Instalación Rápida

### Opción 1: Instalación desde Código Fuente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/music-player.git
cd music-player

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Opción 2: Descargar Binario Pre-construido

Visita la [página de releases](https://github.com/tu-usuario/music-player/releases) para descargar la versión más reciente para tu sistema operativo.

## 🎮 Uso Básico

### Añadir Música Local

1. Abre MusicPlayer
2. Ve a **Biblioteca** → **Añadir carpeta**
3. Selecciona la carpeta que contiene tu música
4. Espera a que termine el escaneo
5. ¡Tu música estará disponible para reproducir!

### Buscar y Reproducir de YouTube

1. Haz clic en la pestaña **Explorar**
2. Usa la barra de búsqueda para buscar canciones o artistas
3. Haz clic en un resultado para reproducirlo inmediatamente
4. Añade videos a la cola para escucharlos en secuencia

### Crear Playlists

1. Ve a la sección **Playlists**
2. Haz clic en **Crear playlist**
3. Añade canciones desde tu biblioteca o resultados de YouTube

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Espacio` | Play/Pausa |
| `Ctrl + ←` | Canción anterior |
| `Ctrl + →` | Siguiente canción |
| `Ctrl + ↑` | Subir volumen |
| `Ctrl + ↓` | Bajar volumen |
| `Ctrl + M` | Silenciar/Reactivar audio |
| `Ctrl + S` | Detener reproducción |
| `Ctrl + L` | Buscar |
| `Ctrl + Q` | Añadir a cola |
| `Ctrl + Shift + R` | Activar/desactivar aleatorio |
| `Ctrl + Shift + L` | Cambiar modo de repetición |
| `F11` | Pantalla completa |
| `Esc` | Cerrar diálogos |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, lee nuestra [guía de contribución](docs/CONTRIBUTING.md) antes de enviar un pull request.

1. Fork el repositorio
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Electron](https://www.electronjs.org/) - Framework de aplicación de escritorio
- [React](https://reactjs.org/) - Biblioteca de interfaz de usuario
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje de programación tipado
- [Vite](https://vitejs.dev/) - Herramienta de construcción rápida
- [Redux Toolkit](https://redux-toolkit.js.org/) - Gestión de estado
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) - Base de datos local
- [ffmpeg](https://ffmpeg.org/) - Procesamiento de audio/video
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Descarga de YouTube

---

<div align="center">

**¿Te gusta MusicPlayer? ⭐️ Dale una estrella en GitHub!**

</div>
