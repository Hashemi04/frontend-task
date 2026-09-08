import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const preview = process.env.PLAYWRIGHT_PREVIEW === "1";

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: false,
  timeout: 30_000,
  use: {
    baseURL,
    channel: "chrome",
    viewport: { width: 1280, height: 720 },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: preview ? "node .output/server/index.mjs" : "pnpm dev",
        url: baseURL,
        reuseExistingServer: !preview,
        timeout: 120_000,
      },
});
