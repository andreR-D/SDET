import { test, expect } from "./fixtures/base";
import { users, products, checkoutInfo } from "./fixtures/test-data";

test.describe("Checkout", () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test("Checkout with empty first name shows error", async ({ checkoutPage }) => {
    await checkoutPage.expectOnStepOne();

    await checkoutPage.fillInfo("", checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError("First Name is required");
  });

  test("Checkout with empty last name shows error", async ({ checkoutPage }) => {
    await checkoutPage.expectOnStepOne();

    await checkoutPage.fillInfo(checkoutInfo.firstName, "", checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError("Last Name is required");
  });

  test("Checkout with empty postal code shows error", async ({ checkoutPage }) => {
    await checkoutPage.expectOnStepOne();

    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, "");
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError("Postal Code is required");
  });
});
