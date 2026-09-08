import { expect, test } from "@playwright/test";

test("search writes the URL, product pages load, unknown ids 404", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByLabel("جستجوی محصول");
  await search.fill("backpack");
  await search.press("Enter");
  await expect(page).toHaveURL(/[?&]q=backpack/);

  await page.getByRole("link", { name: /Fjallraven/ }).click();
  await expect(page).toHaveURL(/\/products\/1/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Fjallraven/ }),
  ).toBeVisible();

  await page.goto("/products/99999");
  await expect(page.getByText("محصول پیدا نشد")).toBeVisible();
});
