import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const imageDir = fileURLToPath(new URL("../public/images/p/", import.meta.url));
const widths = [400, 640, 1000];

const response = await fetch("https://fakestoreapi.com/products");
if (!response.ok) {
  throw new Error(`Catalog fetch failed: ${response.status}`);
}

const products = await response.json();
if (!Array.isArray(products) || products.length === 0) {
  throw new Error("Catalog fetch returned no products");
}

await mkdir(imageDir, { recursive: true });

let generated = 0;

await Promise.all(
  products.map(async (product) => {
    let raw;
    for (const width of widths) {
      const file = join(imageDir, `${product.id}-${width}.webp`);
      try {
        await access(file);
        continue;
      } catch {
        // generate missing size
      }

      if (!raw) {
        const imageResponse = await fetch(product.image);
        if (!imageResponse.ok) {
          throw new Error(`Image fetch failed for product ${product.id}`);
        }
        raw = Buffer.from(await imageResponse.arrayBuffer());
      }

      const body = await sharp(raw)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();
      await writeFile(file, body);
      generated += 1;
    }
  }),
);

for (const product of products) {
  for (const width of widths) {
    await access(join(imageDir, `${product.id}-${width}.webp`));
  }
}

console.log(
  generated
    ? `generated ${generated} catalog images`
    : `verified ${products.length * widths.length} catalog images`,
);
