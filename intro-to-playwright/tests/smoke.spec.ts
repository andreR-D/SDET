import { test, expect } from "./fixtures/base";
import { users, products, checkoutInfo } from "./fixtures/test-data";

test("Full purchase journey - login to order complete", async ({
  loginPage,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  const { username, password } = users.standard();

  // 1. login
  await loginPage.goto();
  await loginPage.login({ username, password });
  await inventoryPage.expectOnInventoryPage();

  // 2. add item to cart
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.expectCartBadgeCount("1");

  // 3. cart
  await inventoryPage.openCart();
  await cartPage.expectOnCartPage();
  await expect(cartPage.itemByName(products.backpack)).toBeVisible();

  // 4. checkout
  await cartPage.checkout();
  await checkoutPage.expectOnStepOne();

  // 5. fill checkout info
  await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
  await checkoutPage.continueToOverview();

  // 6. overview
  await checkoutPage.expectOnStepTwo();
  await expect(checkoutPage.itemNames).toHaveText(products.backpack);
  await expect(checkoutPage.totalLabel).toContainText("Total:");

  // 7. finish
  await checkoutPage.finish();
  await checkoutPage.expectOnComplete();
});
