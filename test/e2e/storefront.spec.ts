import { expect, test, type Page } from "@playwright/test";

/**
 * The catalog is prerendered, so its markup is interactive-looking before Vue
 * has attached listeners. Clicks fired in that window are silently lost, so
 * every test waits for hydration before interacting.
 */
async function gotoHydrated(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test("search writes the URL, product pages load, unknown ids 404", async ({
  page,
}) => {
  await gotoHydrated(page, "/");
  const search = page.getByLabel("جستجوی محصول");
  await search.fill("backpack");
  await search.press("Enter");
  await expect(page).toHaveURL(/[?&]q=backpack/);

  await page.getByRole("link", { name: /Fjallraven/ }).click();
  await expect(page).toHaveURL(/\/products\/1/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Fjallraven/ }),
  ).toBeVisible();

  await page.goto("/products/not-a-product");
  await expect(page.getByText("محصول پیدا نشد")).toBeVisible();
});

test("pagination is real links with self-canonical paginated URLs", async ({
  page,
}) => {
  await gotoHydrated(page, "/");

  const pagination = page.getByRole("navigation", {
    name: "صفحه‌بندی محصولات",
  });
  const secondPage = pagination.getByRole("link", { name: "صفحه ۲" });

  // A link, not a button: middle-clickable, crawlable, shareable.
  await expect(secondPage).toHaveAttribute("href", "/page/2");

  const firstProductOnPageOne = await page
    .locator("article[id^='product-card-']")
    .first()
    .getAttribute("id");

  await secondPage.click();
  await expect(page).toHaveURL(/\/page\/2$/);

  const firstProductOnPageTwo = await page
    .locator("article[id^='product-card-']")
    .first()
    .getAttribute("id");
  expect(firstProductOnPageTwo).not.toBe(firstProductOnPageOne);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/page\/2$/,
  );
  await expect(page.locator('link[rel="prev"]')).toHaveCount(1);
});

test("a paginated URL loads directly and past-the-end clamps", async ({
  page,
}) => {
  await gotoHydrated(page, "/page/3");
  await expect(page).toHaveURL(/\/page\/3$/);
  await expect(
    page.locator("article[id^='product-card-']").first(),
  ).toBeVisible();

  await gotoHydrated(page, "/page/99");
  await expect(page).toHaveURL(/\/page\/3$/);
});

test("filters reset pagination and land back on the clean catalog URL", async ({
  page,
}) => {
  await gotoHydrated(page, "/page/2");

  await page.getByRole("checkbox", { name: /jewelery/ }).check();

  await expect(page).toHaveURL(/\/\?categories=jewelery$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("/page/1 redirects to the clean catalog URL", async ({ page }) => {
  await page.goto("/page/1");
  await expect(page).toHaveURL(/\/$/);
});

test("catalog exposes discoverable SEO surface", async ({ page }) => {
  const robots = await page.request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("/products/1<");
  expect(xml).toContain("/page/2<");
});
