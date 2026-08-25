# Guía de Solución de Problemas

Esta guía proporciona soluciones a problemas comunes que puedes encontrar al usar MusicPlayer.

## 📋 Problemas Comunes y Soluciones

### La aplicación no se inicia

**Síntoma:** Al hacer doble clic en MusicPlayer, la aplicación no responde o no se abre.

**Posibles causas y soluciones:**

1. **Verificar que Node.js está instalado:**
   ```bash
   node --version
   ```
   Si no está instalado, sigue la [guía de instalación](INSTALLATION.md).

2. **Verificar dependencias:**
   ```bash
   npm install
   ```

3. **Verificar permisos:**
   - **Windows:** Ejecuta como administrador
   - **Linux/macOS:**
     ```bash
     sudo chown -R $USER:$USER /ruta/a/music-player
     ```

4. **Verificar puertos:**
   ```bash
   # Verificar si algún proceso usa el puerto 3000
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

5. **Verificar logs:**
   ```bash
   npm run dev 2>&1 | tee debug.log
   ```

---

### Error: "ffmpeg no encontrado"

**Síntoma:**
```
Error: ffmpeg not found. Please install ffmpeg.
```

**Solución:**

1. **Verificar instalación de ffmpeg:**
   ```bash
   ffmpeg -version
   ```

2. **Instalar ffmpeg:**
   - **Windows:**
     ```powershell
     choco install ffmpeg
     ```
   - **macOS:**
     ```bash
     brew install ffmpeg
     ```
   - **Linux:**
     ```bash
     sudo apt install ffmpeg
     ```

3. **Establecer variable de entorno FFMPEG_PATH:**
   - **Windows:**
     ```powershell
     [System.Environment]::SetEnvironmentVariable("FFMPEG_PATH", "C:\ffmpeg\bin\ffmpeg.exe", "User")
     ```
   - **macOS/Linux:**
     ```bash
     export FFMPEG_PATH="/usr/bin/ffmpeg"
     ```

4. **Verificar en la terminal:**
   ```bash
   which ffmpeg  # macOS/Linux
   where ffmpeg  # Windows
   ```

---

### Error: "yt-dlp no encontrado"

**Síntoma:**
```
Error: yt-dlp not found. Please install yt-dlp.
```

**Solución:**

1. **Verificar instalación:**
   ```bash
   yt-dlp --version
   ```

2. **Instalar yt-dlp:**
   ```bash
   pip install yt-dlp
   ```

3. **Verificar ubicación:**
   ```bash
   which yt-dlp
   ```

4. **Establecer variable de entorno:**
   ```bash
   export YT_DLP_PATH="/usr/local/bin/yt-dlp"
   ```

---

## 🔍 Problemas de Escaneo de Biblioteca

### El escaneo no encuentra archivos de audio

**Síntoma:** Después de añadir una carpeta, no aparecen canciones en la biblioteca.

**Solución:**

1. **Verificar formatos soportados:**
   ```
   Formatos soportados: .mp3, .flac, .m4a, .wav, .ogg, .aac, .wma
   ```

2. **Verificar permisos de carpeta:**
   ```bash
   ls -la /ruta/a/musica  # macOS/Linux
   icacls "C:\ruta\a\musica"  # Windows
   ```

3. **Verificar que los archivos no están corruptos:**
   ```bash
   file "/ruta/a/archivo.mp3"
   ```

4. **Probar con una carpeta simple:**
   - Crea una carpeta con 2-3 archivos MP3
   - Añádela a la biblioteca
   - Verifica si aparecen

5. **Revisar logs de escaneo:**
   ```bash
   # En la terminal de desarrollo
   npm run dev
   ```

---

### Escaneo lento o se cuelga

**Síntoma:** El escaneo de la biblioteca tarda mucho o se queda colgado.

**Solución:**

1. **Reducir el número de archivos:**
   - Escanea carpetas una por una
   - Excluye subcarpetas grandes

2. **Verificar disco duro:**
   ```bash
   # Verificar espacio en disco
   df -h  # macOS/Linux
   wmic diskdrive get Model,Size  # Windows
   ```

3. **Cerrar otras aplicaciones:**
   - Libera memoria RAM
   - Cierra aplicaciones que usen mucho CPU

4. **Verificar archivos corruptos:**
   ```bash
   # Linux
   find /ruta -type f -name "*.mp3" -exec file {} \; | grep -v MP3

   # macOS
   find /ruta -type f -name "*.mp3" -exec shasum {} \; | sort
   ```

---

### Metadatos incorrectos o faltantes

**Síntoma:** Las canciones muestran información incorrecta o incompleta.

**Solución:**

1. **Usar un editor de etiquetas:**
   - **Windows:** MP3tag, MusicBrainz Picard
   - **macOS:** MusicBrainz Picard, Kid3
   - **Linux:** MusicBrainz Picard, EasyTAG

2. **Verificar codificación:**
   - Asegúrate de que las etiquetas están en UTF-8

3. **Re-escanear después de editar:**
   ```bash
   Preferencias → Biblioteca → Re-escanear
   ```

4. **Verificar tags ID3:**
   ```bash
   # Usando ffprobe
   ffprobe -v quiet -print_format json -show_format -show_streams archivo.mp3
   ```

---

## 🎵 Problemas de Reproducción

### No se reproduce audio

**Síntoma:** La música no suena aunque la interfaz muestra que está reproduciendo.

**Solución:**

1. **Verificar volumen del sistema:**
   - Asegúrate de que el volumen no está en silencio
   - Verifica que el volumen de MusicPlayer no está en 0

2. **Verificar dispositivo de salida:**
   ```bash
   # Listar dispositivos de audio
   # Windows
   Get-AudioDevice -List

   # macOS
   system_profiler SPAudioDataType

   # Linux
   aplay -l
   ```

3. **Verificar archivo de audio:**
   ```bash
   # Reproducir directamente con ffplay
   ffplay archivo.mp3
   ```

4. **Reiniciar el servicio de audio:**
   - **Linux:**
     ```bash
     sudo systemctl restart alsa-utils
     sudo alsa force-reload
     ```

5. **Reinstalar controladores de audio:**
   - **Windows:** Actualiza drivers de sonido

---

### Reproducción entrecortada (buffering)

**Síntoma:** La música se corta o se reproduce a saltos.

**Solución:**

1. **Verificar recursos del sistema:**
   ```bash
   # Verificar uso de CPU y memoria
   top  # Linux/macOS
   Get-Process | Sort-Object CPU -Descending  # Windows
   ```

2. **Cerrar aplicaciones en segundo plano:**
   - Cierra navegadores con muchas pestañas
   - Cierra aplicaciones que usen mucho ancho de banda

3. **Reducir calidad de streaming (YouTube):**
   - Preferencias → YouTube → Calidad: Media

4. **Aumentar buffer:**
   ```json
   // En config.json
   {
     "player": {
       "bufferSize": 1000
     }
   }
   ```

5. **Verificar disco duro:**
   ```bash
   # Verificar errores de disco
   chkdsk C:  # Windows
   fsck /dev/sda1  # Linux
   ```

---

### La canción no cambia automáticamente

**Síntoma:** Cuando termina una canción, la reproducción se detiene.

**Solución:**

1. **Verificar modo de repetición:**
   - Si está en "off", la reproducción se detendrá al final
   - Cambia a "all" para reproducción continua

2. **Verificar cola de reproducción:**
   - Asegúrate de que hay más canciones en la cola

3. **Verificar modo shuffle:**
   - El modo shuffle puede afectar el orden de reproducción

4. **Revisar consola de errores:**
   ```bash
   npm run dev
   ```

---

### El ecualizador no funciona

**Síntoma:** Los ajustes del ecualizador no afectan al sonido.

**Solución:**

1. **Verificar que el ecualizador está activado:**
   - Preferencias → Ecualizador → Habilitado

2. **Verificar que no hay conflictos:**
   - Desactiva otros efectos de audio

3. **Reiniciar reproducción:**
   - Detén y vuelve a iniciar la reproducción

4. **Verificar drivers de audio:**
   - Algunos drivers pueden no soportar Web Audio API

---

## 🎬 Problemas de YouTube

### Búsqueda no funciona

**Síntoma:** Las búsquedas en YouTube no devuelven resultados.

**Solución:**

1. **Verificar conexión a internet:**
   ```bash
   ping youtube.com
   ```

2. **Verificar yt-dlp:**
   ```bash
   yt-dlp --version
   yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --dump-json
   ```

3. **Verificar variables de entorno:**
   ```bash
   echo $YT_DLP_PATH
   echo $FFMPEG_PATH
   ```

4. **Actualizar yt-dlp:**
   ```bash
   pip install --upgrade yt-dlp
   ```

5. **Verificar API de YouTube:**
   - Si usas clave de API, verifica que está correcta
   - Verifica que la API está habilitada en Google Cloud Console

---

### Error al reproducir video de YouTube

**Síntoma:** Aparece un error al intentar reproducir un video de YouTube.

**Solución:**

1. **Verificar que el video existe:**
   - Abre el video en el navegador

2. **Verificar restricciones del video:**
   - Algunos videos tienen restricciones regionales
   - Videos age-restricted pueden no funcionar

3. **Actualizar yt-dlp:**
   ```bash
   pip install --upgrade yt-dlp
   ```

4. **Verificar ffmpeg:**
   ```bash
   ffmpeg -version
   ```

5. **Revisar logs:**
   ```bash
   npm run dev 2>&1 | grep -i youtube
   ```

---

### Extracción de audio falla

**Síntoma:** No se puede extraer audio de un video de YouTube.

**Solución:**

1. **Verificar ffmpeg:**
   ```bash
   ffmpeg -encoders | grep mp3
   ```

2. **Verificar permisos de escritura:**
   ```bash
   ls -la ~/.musicplayer/
   ```

3. **Verificar espacio en disco:**
   ```bash
   df -h
   ```

4. **Probar con video diferente:**
   - Algunos videos tienen restricciones

5. **Revisar timeout:**
   - Videos largos pueden necesitar más tiempo

---

## ⚡ Problemas de Rendimiento

### Aplicación lenta

**Síntoma:** La interfaz responde lentamente o se congela.

**Solución:**

1. **Reducir tamaño de biblioteca:**
   - Elimina carpetas no utilizadas
   - Desactiva el escaneo automático

2. **Cerrar otras aplicaciones:**
   - Libera memoria RAM

3. **Verificar uso de recursos:**
   ```bash
   # Linux
   htop

   # macOS
   Activity Monitor

   # Windows
   Task Manager
   ```

4. **Borrar caché:**
   ```bash
   rm -rf ~/.cache/musicplayer
   ```

5. **Reiniciar la aplicación:**
   - Cierra completamente y vuelve a abrir

---

### Uso alto de memoria RAM

**Síntoma:** MusicPlayer usa mucha memoria.

**Solución:**

1. **Limitar tamaño de caché:**
   ```json
   {
     "cache": {
       "maxSize": 200
     }
   }
   ```

2. **Cerrar páginas no usadas:**
   - No mantengas muchas pestañas abiertas

3. **Reiniciar periódicamente:**
   - Cierra y abre la aplicación regularmente

4. **Verificar memory leaks:**
   ```bash
   npm run dev -- --inspect
   # Abre chrome://inspect en Chrome
   ```

---

### Disco duro lleno rápidamente

**Síntoma:** El disco se llena debido a archivos de MusicPlayer.

**Solución:**

1. **Borrar archivos temporales:**
   ```bash
   rm -rf ~/.musicplayer/temp/*
   rm -rf ~/.musicplayer/cache/*
   ```

2. **Reducir tamaño de caché:**
   ```json
   {
     "cache": {
       "maxSize": 100
     }
   }
   ```

3. **No extraer audio de YouTube:**
   - Usa streaming en lugar de extracción

4. **Verificar carpeta de datos:**
   ```bash
   du -sh ~/.musicplayer/
   ```

---

## 🔧 Solución de Problemas Avanzados

### Habilitar modo de depuración

```bash
# Linux/macOS
DEBUG=musicplayer:* npm run dev

# Windows (PowerShell)
$env:DEBUG = "musicplayer:*"
npm run dev
```

### Recopilar información de diagnóstico

```bash
# Crear archivo de diagnóstico
npm run dev 2>&1 | tee diagnostic.log

# Información del sistema
echo "=== System Info ===" >> diagnostic.log
uname -a >> diagnostic.log  # Linux/macOS
systeminfo >> diagnostic.log  # Windows

echo "=== Node Version ===" >> diagnostic.log
node --version >> diagnostic.log

echo "=== NPM Version ===" >> diagnostic.log
npm --version >> diagnostic.log

echo "=== Dependencies ===" >> diagnostic.log
npm list >> diagnostic.log
```

### Restablecer configuración

```bash
# Hacer copia de seguridad
cp ~/.config/musicplayer/config.json config.backup.json
cp ~/.config/musicplayer/musicplayer.db db.backup.db

# Eliminar configuración
rm ~/.config/musicplayer/config.json
rm ~/.config/musicplayer/musicplayer.db

# Reiniciar MusicPlayer
```

### Reportar errores

Cuando reportes un error, incluye:

1. **Sistema operativo y versión:**
   ```bash
   # Linux
   cat /etc/os-release

   # macOS
   sw_vers

   # Windows
   winver
   ```

2. **Versión de Node.js:**
   ```bash
   node --version
   ```

3. **Logs de error:**
   ```bash
   npm run dev 2>&1
   ```

4. **Pasos para reproducir el error:**
   - Describe los pasos exactos
   - Incluye capturas de pantalla si es posible

5. **Comportamiento esperado vs actual:**
   - Qué esperabas que pasara
   - Qué pasó realmente

---

## 📞 Recursos Adicionales

- **GitHub Issues:** [github.com/tu-usuario/music-player/issues](https://github.com/tu-usuario/music-player/issues)
- **Documentación:** [docs/README.md](README.md)
- **Instalación:** [docs/INSTALLATION.md](INSTALLATION.md)
- **Configuración:** [docs/CONFIGURATION.md](CONFIGURATION.md)
- **API:** [docs/API.md](API.md)
- **Arquitectura:** [docs/ARCHITECTURE.md](ARCHITECTURE.md)
