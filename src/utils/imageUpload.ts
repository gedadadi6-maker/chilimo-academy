/**
 * Reads an uploaded image/document File and compresses raster images via Canvas
 * so receipts and student certificates remain lightweight for local & Cloud SQL JSON storage.
 */
export function readAndCompressUpload(
  file: File,
  maxWidth = 960,
  quality = 0.74
): Promise<{ dataUrl: string; fileName: string; isImage: boolean }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected file.'));
    reader.onload = () => {
      const rawUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!file.type.startsWith('image/')) {
        if (rawUrl.length > 450_000) {
          reject(new Error('Document file is too large. Please upload an image (JPG/PNG) or PDF under 300 KB.'));
          return;
        }
        resolve({ dataUrl: rawUrl, fileName: file.name, isImage: false });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: rawUrl, fileName: file.name, isImage: true });
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl: compressed, fileName: file.name, isImage: true });
      };
      img.onerror = () => resolve({ dataUrl: rawUrl, fileName: file.name, isImage: true });
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}
