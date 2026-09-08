import { expect, test } from "@playwright/test";

for (const path of ["/", "/page/2", "/products/1", "/faq"]) {
  test(`no console errors or hydration warnings on ${path}`, async ({
    page,
  }) => {
    const problems: string[] = [];
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        problems.push(`${m.type()}: ${m.text()}`);
      }
    });

    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    expect(problems).toEqual([]);
  });
}
