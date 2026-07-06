import { test } from "./fixtures/base";
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

test.describe("Checkout total", () => {
  test("Order total equals subtotal plus tax for multiple items", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();

    const backpackPrice = await inventoryPage.addProduct(products.backpack);
    const bikeLightPrice = await inventoryPage.addProduct(products.bikeLight);
    const expectedSubtotal = backpackPrice + bikeLightPrice;

    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.expectOnStepOne();
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectOnStepTwo();
    await checkoutPage.checkItemNames([products.backpack, products.bikeLight]);
    await checkoutPage.checkOrderSummary();
    await checkoutPage.checkTotal(expectedSubtotal);
  });
});
