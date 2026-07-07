import { test, expect } from "./fixtures/base";
import { users, products } from "./fixtures/test-data";

test.describe("Quirky users - problem_user", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.problem();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  test("Known bug: all product images are broken/identical", async ({ inventoryPage }) => {
    const srcs = await inventoryPage.page.locator(".inventory_item_img img").evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).getAttribute("src"))
    );

    // every image points at the same broken placeholder asset.
    expect(new Set(srcs).size).toBe(1);
  });

  test("Known bug: sort by price low-to-high does not actually sort", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");

    const prices = await inventoryPage.itemPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace("$", "")));
    const sortedValues = [...values].sort((a, b) => a - b);

    expect(values).not.toEqual(sortedValues);
  });
});

test.describe("Quirky users - error_user", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.error();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  test("Known bug: removing an item from inventory does not clear the cart badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount("1");

    await inventoryPage.removeFromCart(products.backpack);

    // bug: the remove click is accepted but the badge/cart state doesn't update.
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });
});
