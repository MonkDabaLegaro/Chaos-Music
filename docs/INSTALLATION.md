# Guía de Instalación

Esta guía detalla cómo instalar y configurar MusicPlayer en diferentes sistemas operativos.

## 📋 Requisitos Previos

### Node.js

MusicPlayer requiere Node.js versión 18.0.0 o superior.

**Verificar instalación:**
```bash
node --version
```

**Instalar Node.js:**
- **Windows/macOS**: Descargar desde [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- **Linux (Fedora):**
  ```bash
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo dnf install -y nodejs
  ```

### ffmpeg

ffmpeg es necesario para la extracción de audio de videos de YouTube.

**Verificar instalación:**
```bash
ffmpeg -version
```

**Instalar ffmpeg:**

- **Windows:**
  1. Descargar desde [gyan.dev](https://gyan.dev/ffmpeg/builds/)
  2. Extraer el archivo ZIP
  3. Añadir la carpeta `bin` al PATH del sistema

  ```powershell
  # Ejemplo con Chocolatey
  choco install ffmpeg
  ```

- **macOS:**
  ```bash
  # Con Homebrew
  brew install ffmpeg
  ```

- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update
  sudo apt install ffmpeg
  ```

- **Linux (Fedora):**
  ```bash
  sudo dnf install ffmpeg
  ```

### yt-dlp

yt-dlp se utiliza para la extracción de audio y streaming desde YouTube.

**Verificar instalación:**
```bash
yt-dlp --version
```

**Instalar yt-dlp:**

- **Windows:**
  ```powershell
  # Con pip
  pip install yt-dlp

  # O con Chocolatey
  choco install yt-dlp
  ```

- **macOS:**
  ```bash
  brew install yt-dlp
  ```

- **Linux:**
  ```bash
  sudo pip3 install yt-dlp
  ```

  O instalar vía pipx:
  ```bash
  pipx install yt-dlp
  ```

### Git (Opcional)

Necesario si deseas clonar el repositorio:

```bash
# Verificar instalación
git --version
```

- **Windows:** Descargar desde [git-scm.com](https://git-scm.com/download/win)
- **macOS:** `brew install git`
- **Linux:** `sudo apt install git` (Ubuntu/Debian)

---

## 🪟 Instalación en Windows

### Método 1: Descargar Binario Pre-construido

1. Visita la [página de releases](https://github.com/tu-usuario/music-player/releases)
2. Descarga el archivo `.exe` o `.msi` más reciente
3. Ejecuta el instalador y sigue las instrucciones
4. MusicPlayer se instalará en `C:\Program Files\MusicPlayer\`

### Método 2: Instalación desde Código Fuente

```powershell
# Abrir PowerShell o CMD como Administrador

# Clonar el repositorio
git clone https://github.com/tu-usuario/music-player.git
cd music-player

# Instalar dependencias
npm install

# Construir la aplicación
npm run build

# Crear instalador (opcional)
npm run build:all
```

### Configuración del PATH (Windows)

Si tienes problemas para ejecutar `ffmpeg` o `yt-dlp` desde MusicPlayer:

1. Presiona `Win + R`, escribe `sysdm.cpl` y presiona Enter
2. Ve a la pestaña **Avanzado** → **Variables de entorno**
3. En **Variables del sistema**, selecciona `Path` y haz clic en **Editar**
4. Añade las rutas necesarias:
   - Ruta a `ffmpeg.exe` (ej: `C:\ffmpeg\bin`)
   - Ruta a `yt-dlp.exe` (si no está en PATH)
5. Reinicia tu terminal y MusicPlayer

---

## 🍎 Instalación en macOS

### Método 1: Descargar Binario Pre-construido

1. Visita la [página de releases](https://github.com/tu-usuario/music-player/releases)
2. Descarga el archivo `.dmg` más reciente
3. Abre el archivo `.dmg` y arrastra MusicPlayer a la carpeta **Aplicaciones**
4. Ejecuta MusicPlayer desde Aplicaciones (puede requerir разрешение de seguridad)

### Método 2: Instalación desde Código Fuente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/music-player.git
cd music-player

# Instalar dependencias
npm install

# Construir la aplicación
npm run build

# Crear instalador DMG (opcional)
npm run build:all
```

### Resolución de Problemas en macOS

**Error: "MusicPlayer está dañado y no puede abrirse":**

```bash
# Eliminar atributo de cuarentena
sudo xattr -rd com.apple.quarantine /Applications/MusicPlayer.app
```

**Permisos de audio:**

MusicPlayer requiere permisos de acceso al micrófono y sistema de audio. Concedelos en:
**Preferencias del Sistema** → **Privacidad y Seguridad** → **Micrófono** / **Accesibilidad**

---

## 🐧 Instalación en Linux

### Método 1: Descargar Binario Pre-construido

1. Visita la [página de releases](https://github.com/tu-usuario/music-player/releases)
2. Descarga el archivo `.AppImage` o `.deb` más reciente

**Para .AppImage:**
```bash
# Hacer ejecutable
chmod +x MusicPlayer-*.AppImage

# Ejecutar
./MusicPlayer-*.AppImage
```

**Para .deb:**
```bash
sudo dpkg -i musicplayer_*.deb
sudo apt-get install -f  # Instalar dependencias si es necesario
```

### Método 2: Instalación desde Código Fuente

```bash
# Instalar dependencias del sistema
sudo apt update
sudo apt install -y build-essential python3 ffmpeg git

# Clonar el repositorio
git clone https://github.com/tu-usuario/music-player.git
cd music-player

# Instalar dependencias
npm install

# Construir la aplicación
npm run build

# Crear instalador AppImage (opcional)
npm run build:all
```

### Instalación de Dependencias en Linux

**ffmpeg:**
```bash
sudo apt install ffmpeg
```

**yt-dlp:**
```bash
sudo pip3 install yt-dlp
```

**Node.js (si no está instalado):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## ⚙️ Configuración de Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `production` |
| `YOUTUBE_API_KEY` | Clave de API de YouTube (opcional) | - |

### Variables Opcionales

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `FFMPEG_PATH` | Ruta personalizada a ffmpeg | `/usr/bin/ffmpeg` |
| `YT_DLP_PATH` | Ruta personalizada a yt-dlp | `/usr/local/bin/yt-dlp` |
| `MUSIC_PLAYER_DATA` | Carpeta de datos de la aplicación | `~/.musicplayer` |

### Configurar Variables de Entorno

**Windows (PowerShell):**
```powershell
# Temporal (sesión actual)
$env:FFMPEG_PATH = "C:\ffmpeg\bin\ffmpeg.exe"

# Permanente
[System.Environment]::SetEnvironmentVariable("FFMPEG_PATH", "C:\ffmpeg\bin\ffmpeg.exe", "User")
```

**Windows (CMD):**
```cmd
setx FFMPEG_PATH "C:\ffmpeg\bin\ffmpeg.exe"
```

**macOS/Linux (Bash):**
```bash
# Temporal (sesión actual)
export FFMPEG_PATH="/usr/bin/ffmpeg"

# Permanente (~/.bashrc o ~/.zshrc)
echo 'export FFMPEG_PATH="/usr/bin/ffmpeg"' >> ~/.bashrc
source ~/.bashrc
```

**macOS/Linux (Fish):**
```fish
# Temporal
set -x FFMPEG_PATH "/usr/bin/ffmpeg"

# Permanente
set -Ux FFMPEG_PATH "/usr/bin/ffmpeg"
```

---

## ✅ Verificar Instalación

Para verificar que todo está correctamente instalado:

```bash
# Verificar Node.js
node --version  # Debe ser >= 18.0.0

# Verificar npm
npm --version

# Verificar ffmpeg
ffmpeg -version

# Verificar yt-dlp
yt-dlp --version

# Verificar instalación de MusicPlayer
npm run typecheck
```

---

## 🧩 Solución de Problemas Comunes

### Error: "ffmpeg no encontrado"

**Síntoma:**
```
Error: ffmpeg not found. Please install ffmpeg.
```

**Solución:**
1. Verifica que ffmpeg está instalado: `ffmpeg -version`
2. Añade ffmpeg al PATH del sistema
3. O establece la variable `FFMPEG_PATH`

### Error: "yt-dlp no encontrado"

**Síntoma:**
```
Error: yt-dlp not found. Please install yt-dlp.
```

**Solución:**
1. Verifica que yt-dlp está instalado: `yt-dlp --version`
2. Añade yt-dlp al PATH del sistema
3. O establece la variable `YT_DLP_PATH`

### Error de Permisos en Linux

**Síntoma:**
```
EACCES: permission denied
```

**Solución:**
```bash
# Verificar permisos de la carpeta del proyecto
sudo chown -R $USER:$USER /ruta/a/music-player

# O usar npm sin sudo
npm install --unsafe-perm
```

### Problemas con node-gyp

**Síntoma:**
```
gyp ERR! ...
```

**Solución:**
```bash
# Instalar herramientas de compilación
# Windows
npm install --global --production windows-build-tools

# Linux
sudo apt install build-essential python3

# macOS
xcode-select --install
```

### Error de Memoria Insuficiente

**Síntoma:**
```
JavaScript heap out of memory
```

**Solución:**
```bash
# Aumentar límite de memoria
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📚 Recursos Adicionales

- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Electron](https://www.electronjs.org/docs)
- [Documentación de React](https://reactjs.org/docs)
- [Documentación de Vite](https://vitejs.dev/guide/)
- [ffmpeg Documentation](https://ffmpeg.org/documentation.html)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp#readme)
