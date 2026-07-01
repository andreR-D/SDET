import { test, expect } from "@playwright/test";

test("Remove item from cart", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. add item to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  // 3. cart
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator(".title")).toHaveText("Your Cart");

  // 4. remove item
  await page.getByRole("button", { name: "Remove" }).click();

  // 5. make sure remove work
  await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
  await expect(page.locator(".cart_item")).toHaveCount(0);
});

test("Add multiple items and verify cart count", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. Add three items
  // await page
  //   .locator(".inventory_item", { hasText: "Sauce Labs Backpack" })
  //   .getByRole("button", { name: "Add to cart" })
  //   .click();
  // await page
  //   .locator(".inventory_item", { hasText: "Sauce Labs Bike Light" })
  //   .getByRole("button", { name: "Add to cart" })
  //   .click();
  // await page
  //   .locator(".inventory_item", { hasText: "Sauce Labs Bolt T-Shirt" })
  //   .getByRole("button", { name: "Add to cart" })
  //   .click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

  // 3. item should update
  await expect(page.locator(".shopping_cart_badge")).toHaveText("3");

  // 4. cart
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator(".title")).toHaveText("Your Cart");
  await expect(page.locator(".cart_item")).toHaveCount(3);
  await expect(page.locator(".cart_item_label", { hasText: "Sauce Labs Backpack" })).toBeVisible();
  await expect(page.locator(".cart_item_label", { hasText: "Sauce Labs Bike Light" })).toBeVisible();
  await expect(page.locator(".cart_item_label", { hasText: "Sauce Labs Bolt T-Shirt" })).toBeVisible();
});

test("Continue shopping from cart returns to inventory", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. add item and go to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator(".title")).toHaveText("Your Cart");

  // 3. back
  await page.getByRole("button", { name: "Continue Shopping" }).click();
  await expect(page).toHaveURL(/\/inventory/);
});
