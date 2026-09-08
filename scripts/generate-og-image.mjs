import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Renders the static social card at `public/og-default.png`.
 * Run by hand when the brand text or colours change.
 */
const root = new URL("../", import.meta.url);
const font = readFileSync(
  fileURLToPath(new URL("public/fonts/YekanBakhFaNum-Bold.woff2", root)),
).toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: "Yekan Bakh";
        src: url("data:font/woff2;base64,${font}") format("woff2");
        font-weight: 700;
      }
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a2a51"/>
      <stop offset="100%" stop-color="#c2185b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="48" fill="#ffffff" opacity="0.06"/>
  <text x="600" y="300" text-anchor="middle" direction="rtl"
        font-family="Yekan Bakh" font-weight="700" font-size="104" fill="#ffffff">فروشگاه</text>
  <text x="600" y="380" text-anchor="middle" direction="rtl"
        font-family="Yekan Bakh" font-weight="700" font-size="40" fill="#fce4ec">لیست محصولات</text>
</svg>`;

const out = fileURLToPath(new URL("public/og-default.png", root));
const buffer = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
writeFileSync(out, buffer);
console.log(`[og] wrote public/og-default.png (${buffer.length} bytes)`);
