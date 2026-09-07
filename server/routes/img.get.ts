import { send } from "h3";
import sharp from "sharp";

const ALLOWED_HOST = "fakestoreapi.com";
const cache = new Map<string, Buffer>();

export default defineEventHandler(async (event) => {
  const src = getQuery(event).src;
  const width = Number(getQuery(event).w) || 400;

  if (typeof src !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing image src" });
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid image src" });
  }

  if (url.protocol !== "https:" || url.hostname !== ALLOWED_HOST) {
    throw createError({ statusCode: 400, statusMessage: "Image host not allowed" });
  }

  const size = Math.min(Math.max(Math.round(width), 48), 1200);
  const key = `${src}|${size}`;
  let body = cache.get(key);

  if (!body) {
    let raw: ArrayBuffer;
    try {
      raw = await $fetch<ArrayBuffer>(src, { responseType: "arrayBuffer" });
    } catch {
      throw createError({ statusCode: 502, statusMessage: "Image fetch failed" });
    }

    body = await sharp(Buffer.from(raw))
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 68 })
      .toBuffer();
    cache.set(key, body);
  }

  setResponseHeader(event, "Content-Type", "image/webp");
  setResponseHeader(
    event,
    "Cache-Control",
    "public, max-age=31536000, immutable",
  );

  return send(event, body, "image/webp");
});
