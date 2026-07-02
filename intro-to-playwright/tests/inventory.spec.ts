import { test, expect } from "./fixtures/base";
import { users, products } from "./fixtures/test-data";

test.describe("Inventory", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  test("Sort products by price low to high", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");

    await expect(inventoryPage.itemPrices.first()).toHaveText("$7.99");
  });

  test("Sort products by price high to low", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("hilo");

    await expect(inventoryPage.itemPrices.first()).toHaveText("$49.99");
  });

  test("Sort products by name Z to A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");

    await expect(inventoryPage.itemNames.first()).toHaveText("Test.allTheThings() T-Shirt (Red)");
  });

  test("Product detail page renders correctly", async ({ inventoryPage, productDetailPage }) => {
    await inventoryPage.openProduct(products.backpack);

    await productDetailPage.expectOnDetailPage();
    await expect(productDetailPage.name).toHaveText(products.backpack);
    await expect(productDetailPage.price).toBeVisible();
    await expect(productDetailPage.image).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });
});
