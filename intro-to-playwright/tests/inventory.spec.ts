import { test, expect } from "@playwright/test";

test("Sort products by price low to high", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. sort by price low to high
  await page.locator(".product_sort_container").selectOption("lohi");

  // 3. should be the cheapest
  await expect(page.locator(".inventory_item_price").first()).toHaveText("$7.99");
});

test("Sort products by price high to low", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. sort by price high to low
  await page.locator(".product_sort_container").selectOption("hilo");

  // 3. should be the most expensive
  await expect(page.locator(".inventory_item_price").first()).toHaveText("$49.99");
});

test("Sort products by name Z to A", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. sort by name Z to A
  await page.locator(".product_sort_container").selectOption("za");

  // 3. should start with T (Test.allTheThings)
  await expect(page.locator(".inventory_item_name").first()).toHaveText("Test.allTheThings() T-Shirt (Red)");
});

test("Product detail page renders correctly", async ({ page }) => {
  // 1. login
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/inventory/);

  // 2. click on product
  await page.locator(".inventory_item_name", { hasText: "Sauce Labs Backpack" }).click();
  await expect(page).toHaveURL(/\/inventory-item\.html/);

  // 3. product detail
  await expect(page.locator(".inventory_details_name")).toHaveText("Sauce Labs Backpack");
  await expect(page.locator(".inventory_details_price")).toBeVisible();
  await expect(page.locator(".inventory_details_img")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();
});
