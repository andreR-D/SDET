import { test } from "./fixtures/base";
import { users, products, checkoutInfo } from "./fixtures/test-data";

test.describe("Checkout - field validation", () => {
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

  test("Checkout with all fields empty shows first name error", async ({ checkoutPage }) => {
    await checkoutPage.expectOnStepOne();

    await checkoutPage.fillInfo("", "", "");
    await checkoutPage.continueToOverview();

    // SauceDemo validates top-down, so the first name error wins when everything is blank.
    await checkoutPage.expectError("First Name is required");
  });

  test("Cancel on step one returns to cart", async ({ checkoutPage, cartPage }) => {
    await checkoutPage.expectOnStepOne();

    await checkoutPage.cancel();

    await cartPage.expectOnCartPage();
  });
});

test.describe("Checkout - order totals", () => {
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

  test("Order total equals price for a single item", async ({
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

    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.expectOnStepOne();
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectOnStepTwo();
    await checkoutPage.checkTotal(backpackPrice);
  });

  test("Cancel on step two returns to inventory", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const { username, password } = users.standard();
    await loginPage.goto();
    await loginPage.login({ username, password });
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOnStepTwo();

    await checkoutPage.cancel();

    await inventoryPage.expectOnInventoryPage();
  });
});
