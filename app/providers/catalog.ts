import { defineProvider } from "@nuxt/image/runtime";
import { catalogImagePath, parseCatalogImageSrc } from "../utils/catalogImage";

export default defineProvider({
  getImage(src, { modifiers }) {
    const productId = parseCatalogImageSrc(src);
    return {
      url: catalogImagePath(productId, modifiers.width),
    };
  },
});
