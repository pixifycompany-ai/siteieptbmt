// Gera as imagens do site institucional em WebP de alta qualidade, em várias larguras (srcset).
//
// Uso: npm run images
//   origem:  assets-src/site/*.{jpg,jpeg,png}   (originais em resolução máxima — fora do git)
//   destino: public/site/img/<nome>-<largura>.webp
//   manifesto: src/site/image-manifest.json  ({ "<nome>": [larguras disponíveis] })
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src/site";
const OUT = "public/site/img";
const MANIFEST = "src/site/image-manifest.json";
const WIDTHS = [256, 400, 640, 960, 1280, 1920, 2560, 3200, 3840];
// Qualidade máxima nas versões grandes (monitores e telas retina); nas pequenas (celular),
// 82 é visualmente idêntico e deixa a página bem mais leve.
const qualityFor = (w) => (w >= 1920 ? 90 : w >= 1280 ? 86 : 82);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const manifest = {};
let total = 0;

for (const file of files) {
  const name = path.parse(file).name;
  const input = sharp(path.join(SRC, file), { failOn: "none" }).rotate();
  const { width } = await input.metadata();
  // Todas as larguras menores que a original + a própria original (limitada a 3840).
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, 3840));
  const unique = [...new Set(widths)].sort((a, b) => a - b);

  for (const w of unique) {
    const info = await input
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: qualityFor(w), effort: 6, smartSubsample: true })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
    total += info.size;
  }
  manifest[name] = unique;
  console.log(`${name}: ${unique.join(", ")}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${files.length} imagens → ${(total / 1024 / 1024).toFixed(1)} MB em ${OUT}`);
