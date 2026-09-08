import { gzipSync } from "node:zlib";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("beforeResponse", (event, response) => {
    if (getResponseHeader(event, "content-encoding")) {
      return;
    }

    const accept = getRequestHeader(event, "accept-encoding") ?? "";
    if (!accept.includes("gzip")) {
      return;
    }

    const type = String(getResponseHeader(event, "content-type") ?? "");
    if (type.includes("image/") || type.includes("font/") || type.includes("octet-stream")) {
      return;
    }

    let { body } = response;
    if (body == null) {
      return;
    }

    if (typeof body === "object" && !Buffer.isBuffer(body) && !(body instanceof Uint8Array)) {
      body = JSON.stringify(body);
      setResponseHeader(event, "content-type", "application/json; charset=utf-8");
    }

    if (typeof body !== "string" && !Buffer.isBuffer(body) && !(body instanceof Uint8Array)) {
      return;
    }

    const input = typeof body === "string" ? Buffer.from(body) : Buffer.from(body);
    if (input.length < 512) {
      return;
    }

    const compressed = gzipSync(input);
    response.body = compressed;
    setResponseHeader(event, "content-encoding", "gzip");
    setResponseHeader(event, "content-length", compressed.byteLength);
    setResponseHeader(event, "vary", "Accept-Encoding");
  });
});
