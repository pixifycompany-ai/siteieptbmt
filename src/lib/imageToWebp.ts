/**
 * Converte uma imagem para WebP no navegador antes do upload para o Supabase Storage.
 *
 * - Mantém alta qualidade (padrão 0.9) e só reduz se passar de `maxSize` px no maior lado.
 * - SVG e GIF (vetor/animação) são enviados como estão.
 * - Se o navegador não souber gerar WebP, ou se o WebP ficar maior que um original já em WebP,
 *   devolve o arquivo original — o upload nunca é bloqueado pela conversão.
 */
export async function imageToWebp(
  file: File,
  { maxSize = 2560, quality = 0.9 }: { maxSize?: number; quality?: number } = {},
): Promise<File> {
  if (!file.type.startsWith("image/") || /svg|gif/.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob || blob.type !== "image/webp") return file;
    if (file.type === "image/webp" && blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } catch {
    return file;
  }
}

/** Extensão a usar no caminho do Storage a partir do tipo final do arquivo. */
export const extensionFor = (file: File) =>
  file.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "bin").toLowerCase();
