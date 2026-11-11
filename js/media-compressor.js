/**
 * M.C.P Ultra-Aggressive Media & Audio Compressor Engine
 * Pipeline inteligente de compressão pré-upload e pós-upload:
 * 1. Mídia selecionada/gravada
 * 2. Compressão ultra-agressiva client-side (WebP 0.72 + Web Audio Resampling)
 * 3. Upload otimizado ao Supabase Storage
 * 4. Anexo imediato à CacheStorage local (0 consumo posterior de banda)
 */

(function(window) {
  'use strict';

  const CACHE_NAME = 'mcp-offline-media-v1';

  const MediaCompressor = {
    /**
     * Comprime imagens agressivamente convertendo para WebP de alta eficiência
     * @param {File|Blob} file - Arquivo original
     * @param {Object} options - Configurações (maxWidth, maxHeight, quality)
     * @returns {Promise<{ blob: Blob, originalSize: number, compressedSize: number, ratio: string }>}
     */
    async compressImage(file, options = {}) {
      const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.72,
        format = 'image/webp'
      } = options;

      const originalSize = file.size;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => {
          const img = new Image();
          img.onerror = reject;
          img.onload = () => {
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            // Calcula proporções máximas
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

            // Renderiza com suavização máxima
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  // Fallback se toBlob falhar
                  return resolve({
                    blob: file,
                    originalSize,
                    compressedSize: originalSize,
                    ratio: '0%'
                  });
                }
                const compressedSize = blob.size;
                const ratio = ((1 - (compressedSize / originalSize)) * 100).toFixed(1) + '%';
                console.log(`[Compressor] Imagem otimizada: ${(originalSize/1024).toFixed(0)}KB ➔ ${(compressedSize/1024).toFixed(0)}KB (Economia: ${ratio})`);
                
                resolve({
                  blob,
                  originalSize,
                  compressedSize,
                  ratio,
                  width,
                  height
                });
              },
              format,
              quality
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    /**
     * Comprime áudios do Diário e notas de voz com downsampling mono
     * @param {File|Blob} file - Arquivo ou gravação original
     * @returns {Promise<{ blob: Blob, originalSize: number, compressedSize: number, ratio: string }>}
     */
    async compressAudio(file) {
      const originalSize = file.size;
      try {
        const arrayBuffer = await file.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          return { blob: file, originalSize, compressedSize: originalSize, ratio: '0%' };
        }

        const audioCtx = new AudioContextClass();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        // Downmix para Mono a 24000Hz (voz e diário com clareza máxima e tamanho minúsculo)
        const targetSampleRate = 24000;
        const offlineCtx = new OfflineAudioContext(1, Math.ceil(audioBuffer.duration * targetSampleRate), targetSampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start(0);

        const renderedBuffer = await offlineCtx.startRendering();
        
        // Exporta como WAV/Blob otimizado
        const monoWavBlob = this._audioBufferToWav(renderedBuffer);
        const compressedSize = monoWavBlob.size;
        const ratio = ((1 - (compressedSize / originalSize)) * 100).toFixed(1) + '%';
        console.log(`[Compressor] Áudio otimizado: ${(originalSize/1024).toFixed(0)}KB ➔ ${(compressedSize/1024).toFixed(0)}KB (Economia: ${ratio})`);

        return {
          blob: monoWavBlob,
          originalSize,
          compressedSize,
          ratio
        };
      } catch (err) {
        console.warn('[Compressor] Fallback para áudio original:', err);
        return { blob: file, originalSize, compressedSize: originalSize, ratio: '0%' };
      }
    },

    /**
     * Auxiliar para converter AudioBuffer renderizado em WAV leve
     */
    _audioBufferToWav(buffer) {
      const numChannels = 1;
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      const samples = buffer.getChannelData(0);
      const dataLength = samples.length * (bitDepth / 8);
      const headerLength = 44;
      const totalLength = headerLength + dataLength;

      const out = new ArrayBuffer(totalLength);
      const view = new DataView(out);

      function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      writeString(view, 0, 'RIFF');
      view.setUint32(4, totalLength - 8, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
      view.setUint16(32, numChannels * (bitDepth / 8), true);
      view.setUint16(34, bitDepth, true);
      writeString(view, 36, 'data');
      view.setUint32(40, dataLength, true);

      let offset = 44;
      for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      return new Blob([view], { type: 'audio/wav' });
    },

    /**
     * Pipeline Automático de Otimização Pré-Upload
     * @param {File|Blob} file 
     * @returns {Promise<{ fileToUpload: File|Blob, ratio: string, contentType: string }>}
     */
    async processForUpload(file) {
      const type = file.type || '';

      if (type.startsWith('image/')) {
        const res = await this.compressImage(file);
        const fileName = (file.name || 'image').replace(/\.[^/.]+$/, "") + ".webp";
        const compressedFile = new File([res.blob], fileName, { type: 'image/webp' });
        return {
          fileToUpload: compressedFile,
          ratio: res.ratio,
          contentType: 'image/webp'
        };
      }

      if (type.startsWith('audio/')) {
        const res = await this.compressAudio(file);
        const fileName = (file.name || 'audio').replace(/\.[^/.]+$/, "") + ".wav";
        const compressedFile = new File([res.blob], fileName, { type: 'audio/wav' });
        return {
          fileToUpload: compressedFile,
          ratio: res.ratio,
          contentType: 'audio/wav'
        };
      }

      return {
        fileToUpload: file,
        ratio: '0%',
        contentType: file.type || 'application/octet-stream'
      };
    },

    /**
     * Anexa imediatamente qualquer nova mídia ao cache offline permanente
     * @param {string} publicUrl 
     * @param {Blob|Response|File} dataBlob 
     */
    async attachToOfflineCache(publicUrl, dataBlob) {
      if (!('caches' in window) || !publicUrl) return;
      try {
        const cache = await caches.open(CACHE_NAME);
        let responseToStore;

        if (dataBlob instanceof Response) {
          responseToStore = dataBlob.clone();
        } else if (dataBlob instanceof Blob || dataBlob instanceof File) {
          responseToStore = new Response(dataBlob, {
            status: 200,
            headers: {
              'Content-Type': dataBlob.type || 'application/octet-stream',
              'Content-Length': String(dataBlob.size),
              'Cache-Control': 'public, max-age=31536000, immutable'
            }
          });
        } else {
          // Busca e armazena via rede
          const fetched = await fetch(publicUrl, { mode: 'cors' });
          if (fetched && (fetched.status === 200 || fetched.type === 'opaque')) {
            await cache.put(publicUrl, fetched.clone());
            return;
          }
        }

        if (responseToStore) {
          await cache.put(publicUrl, responseToStore);
          console.log(`[MediaCompressor] Mídia anexada instantaneamente ao cache offline:`, publicUrl);
          
          // Atualiza Widget Network Saver se ativo
          if (window.McpMediaCacheManager && typeof window.McpMediaCacheManager.notifyNewMediaCached === 'function') {
            window.McpMediaCacheManager.notifyNewMediaCached(publicUrl);
          }
        }
      } catch (err) {
        console.warn('[MediaCompressor] Erro ao anexar mídia ao cache:', err);
      }
    }
  };

  window.MediaCompressor = MediaCompressor;
})(window);
