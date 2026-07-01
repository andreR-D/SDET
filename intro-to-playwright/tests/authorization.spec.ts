import { test, expect } from "@playwright/test";

test("Login with valid credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/inventory/);
});

test("Login with locked out user", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("locked_out_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toContainText(
    "Sorry, this user has been locked out"
  );
});

test("Login with wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toContainText(
    "Username and password do not match"
  );
});

test("Login with empty username", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toContainText(
    "Username is required"
  );
});

test("Login with empty password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toContainText(
    "Password is required"
  );
});

test("Login with empty username and password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("");
  await page.getByRole("textbox", { name: "Password" }).fill("");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toContainText(
    "Username is required"
  );
});
