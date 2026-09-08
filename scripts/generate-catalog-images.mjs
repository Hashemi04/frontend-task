import { access, mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Build-time artifact: writes `/images/p/{id}-{width}.webp` for the catalog
 * image provider. Output is gitignored — CI and Vercel regenerate it. Do not
 * commit third-party product photos.
 *
 * `--strict` (build/generate) exits non-zero when a size is missing.
 * Without it (dev) a missing size is a warning so the app can still boot.
 */
const imageDir = fileURLToPath(new URL("../public/images/p/", import.meta.url));
const fixturePath = fileURLToPath(
  new URL("../data/catalog.json", import.meta.url),
);
const widths = [400, 640, 1000];
const strict = process.argv.includes("--strict");
const FETCH_TIMEOUT_MS = 10_000;

function timeout() {
  return AbortSignal.timeout(FETCH_TIMEOUT_MS);
}

async function loadCatalog() {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      signal: timeout(),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("payload was empty");
    }

    return products;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[images] Fake Store unreachable (${reason}); using data/catalog.json`,
    );
    return JSON.parse(readFileSync(fixturePath, "utf8"));
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const products = await loadCatalog();
await mkdir(imageDir, { recursive: true });

let generated = 0;
const missing = [];

await Promise.all(
  products.map(async (product) => {
    let raw;

    for (const width of widths) {
      const file = join(imageDir, `${product.id}-${width}.webp`);
      if (await exists(file)) {
        continue;
      }

      if (!raw) {
        try {
          const imageResponse = await fetch(product.image, {
            signal: timeout(),
          });
          if (!imageResponse.ok) {
            throw new Error(`HTTP ${imageResponse.status}`);
          }
          raw = Buffer.from(await imageResponse.arrayBuffer());
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          missing.push(`${product.id} (source fetch failed: ${reason})`);
          return;
        }
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
    if (!(await exists(join(imageDir, `${product.id}-${width}.webp`)))) {
      missing.push(`${product.id}-${width}.webp`);
    }
  }
}

if (missing.length) {
  const detail = [...new Set(missing)].join(", ");
  if (strict) {
    console.error(`[images] missing catalog images: ${detail}`);
    process.exit(1);
  }
  console.warn(
    `[images] missing catalog images (dev continues, those will 404): ${detail}`,
  );
} else if (generated) {
  console.log(`[images] generated ${generated} catalog images`);
} else {
  console.log(
    `[images] verified ${products.length * widths.length} catalog images`,
  );
}
