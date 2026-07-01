import { test, expect } from "@playwright/test";

test("Full purchase journey - login to order complete", async ({ page }) => {
  // 1.login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  // 3. landing page
  await expect(page).toHaveURL(/\/inventory/);

  // 4. add item to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // 5. make sure item added to cart
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  // 6. cart
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator(".title")).toHaveText("Your Cart");

  // 7. make sure item in cart
  await expect(page.locator(".cart_item_label", { hasText: "Sauce Labs Backpack" })).toBeVisible();

  // 8. checkout
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout-step-one/);
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");


  // 9. data for checkout
  await page.getByRole("textbox", { name: "First Name" }).fill("Andre");
  await page.getByRole("textbox", { name: "Last Name" }).fill("Keren");
  await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("1234");
  await page.getByRole("button", { name: "Continue" }).click();

  // 10. verify correct item
  await expect(page).toHaveURL(/\/checkout-step-two/);
  await expect(page.locator(".title")).toHaveText("Checkout: Overview");
  await expect(page.locator(".inventory_item_name")).toHaveText("Sauce Labs Backpack");
  await expect(page.locator(".summary_total_label")).toContainText("Total:");

  // 11. finish
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page).toHaveURL(/\/checkout-complete/);
  await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");
});
