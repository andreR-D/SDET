import { test, expect } from "./fixtures/base";
import { users, products } from "./fixtures/test-data";

test.describe("Cart", () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();
  });

  test("Remove item from cart", async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount("1");

    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();

    await cartPage.removeItem();

    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test("Add multiple items and verify cart count", async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.addToCart(products.boltTShirt);

    await inventoryPage.expectCartBadgeCount("3");

    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();

    await expect(cartPage.cartItems).toHaveCount(3);
    await expect(cartPage.itemByName(products.backpack)).toBeVisible();
    await expect(cartPage.itemByName(products.bikeLight)).toBeVisible();
    await expect(cartPage.itemByName(products.boltTShirt)).toBeVisible();
  });

  test("Continue shopping from cart returns to inventory", async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();

    await cartPage.continueShopping();

    await inventoryPage.expectOnInventoryPage();
  });
});
