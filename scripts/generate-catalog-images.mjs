import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const imageDir = fileURLToPath(new URL("../public/images/p/", import.meta.url));
const widths = [400, 640, 1000];

async function alreadyGenerated() {
  try {
    await access(join(imageDir, "1-400.webp"));
    await access(join(imageDir, "20-1000.webp"));
    return true;
  } catch {
    return false;
  }
}

if (await alreadyGenerated()) {
  console.log("catalog images already present");
} else {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error(`Catalog fetch failed: ${response.status}`);
  }

  const products = await response.json();
  await mkdir(imageDir, { recursive: true });

  await Promise.all(
    products.map(async (product) => {
      const raw = Buffer.from(await fetch(product.image).then((res) => res.arrayBuffer()));
      await Promise.all(
        widths.map(async (width) => {
          const body = await sharp(raw)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 70 })
            .toBuffer();
          await writeFile(join(imageDir, `${product.id}-${width}.webp`), body);
        }),
      );
    }),
  );

  console.log(`generated ${products.length * widths.length} catalog images`);
}
