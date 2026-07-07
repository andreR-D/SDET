import { test, expect } from "./fixtures/base";
import { users, products, allProducts } from "./fixtures/test-data";

test.describe("Inventory - sorting", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  test("Sort products by name A to Z (default)", async ({ inventoryPage }) => {
    const expected = [...allProducts].sort((a, b) => a.localeCompare(b));

    await expect(inventoryPage.itemNames).toHaveText(expected);
  });

  test("Sort products by name Z to A", async ({ inventoryPage }) => {
    const expected = [...allProducts].sort((a, b) => b.localeCompare(a));

    await inventoryPage.sortBy("za");

    await expect(inventoryPage.itemNames).toHaveText(expected);
  });

  test("Sort products by price low to high", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");

    const prices = await inventoryPage.itemPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace("$", "")));

    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  test("Sort products by price high to low", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("hilo");

    const prices = await inventoryPage.itemPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace("$", "")));

    expect(values).toEqual([...values].sort((a, b) => b - a));
  });
});

test.describe("Inventory - product detail", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  for (const product of allProducts) {
    test(`Product detail page renders correctly for ${product}`, async ({
      inventoryPage,
      productDetailPage,
    }) => {
      await inventoryPage.openProduct(product);

      await productDetailPage.expectOnDetailPage();
      await expect(productDetailPage.name).toHaveText(product);
      await expect(productDetailPage.price).toBeVisible();
      await expect(productDetailPage.image).toBeVisible();
      await expect(productDetailPage.addToCartButton).toBeVisible();
    });
  }

  test("Add to cart from product detail page updates badge", async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.openProduct(products.backpack);

    await productDetailPage.addToCart();

    await expect(productDetailPage.removeButton).toBeVisible();
    await expect(productDetailPage.cartBadge).toHaveText("1");
  });

  test("Back to products returns to inventory page", async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.openProduct(products.backpack);
    await productDetailPage.expectOnDetailPage();

    await productDetailPage.backToProducts();

    await inventoryPage.expectOnInventoryPage();
  });
});

test.describe("Inventory - app state", () => {
  test("Reset App State clears the cart", async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount("1");

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test("Logout from inventory returns to login page", async ({
    loginPage,
    inventoryPage,
  }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
