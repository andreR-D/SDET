import { test, expect } from "@playwright/test";

test("Checkout with empty first name shows error", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. add item and go to checkout
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout-step-one/);
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");

  // 3. empty first name
  await page.getByRole("textbox", { name: "First Name" }).fill("");
  await page.getByRole("textbox", { name: "Last Name" }).fill("Keren");
  await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("1234");
  await page.getByRole("button", { name: "Continue" }).click();

  // 4. should error
  await expect(page.locator("[data-test='error']")).toContainText("First Name is required");
});

test("Checkout with empty last name shows error", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. add item and go to checkout
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout-step-one/);
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");

  // 3. empty last name
  await page.getByRole("textbox", { name: "First Name" }).fill("Andre");
  await page.getByRole("textbox", { name: "Last Name" }).fill("");
  await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("1234");
  await page.getByRole("button", { name: "Continue" }).click();

  // 4. error
  await expect(page.locator("[data-test='error']")).toContainText("Last Name is required");
});

test("Checkout with empty postal code shows error", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. add item and go to checkout
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout-step-one/);
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");

  // 3. empty postal code
  await page.getByRole("textbox", { name: "First Name" }).fill("Andre");
  await page.getByRole("textbox", { name: "Last Name" }).fill("Keren");
  await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("");
  await page.getByRole("button", { name: "Continue" }).click();

  // 4. error
  await expect(page.locator("[data-test='error']")).toContainText("Postal Code is required");
});
