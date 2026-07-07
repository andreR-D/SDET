import { test, expect } from "./fixtures/base";
import { users } from "./fixtures/test-data";

test.describe("Authorization", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("Login with valid credentials", async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.standard();
    await loginPage.login({ username, password });

    await inventoryPage.expectOnInventoryPage();
  });

  test("Login with locked out user", async ({ loginPage }) => {
    const { username, password } = users.lockedOut();
    await loginPage.login({ username, password });

    await loginPage.expectError("Sorry, this user has been locked out");
  });

  test("Login with wrong password", async ({ loginPage }) => {
    const { username } = users.standard();
    await loginPage.login({ username, password: "wrong_password" });

    await loginPage.expectError("Username and password do not match");
  });

  test("Login with empty username", async ({ loginPage }) => {
    const { password } = users.standard();
    await loginPage.login({ username: "", password });

    await loginPage.expectError("Username is required");
  });

  test("Login with empty password", async ({ loginPage }) => {
    const { username } = users.standard();
    await loginPage.login({ username, password: "" });

    await loginPage.expectError("Password is required");
  });

  test("Login with empty username and password", async ({ loginPage }) => {
    await loginPage.login({ username: "", password: "" });

    await loginPage.expectError("Username is required");
  });

  test("Login with problem user succeeds despite known UI bugs", async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.problem();
    await loginPage.login({ username, password });

    await inventoryPage.expectOnInventoryPage();
  });

  test("Login with error user succeeds", async ({ loginPage, inventoryPage }) => {
    const { username, password } = users.error();
    await loginPage.login({ username, password });

    await inventoryPage.expectOnInventoryPage();
  });
});

test.describe("Authorization - direct URL access", () => {
  test("Visiting inventory directly without logging in shows an error", async ({ page, inventoryPage }) => {
    await page.goto("/inventory.html");

    await expect(page.locator('[data-test="error"]')).toContainText(
      "You can only access '/inventory.html' when you are logged in"
    );
    await expect(inventoryPage.pageTitle).not.toBeVisible();
  });

  test("Visiting cart directly without logging in shows an error", async ({ page }) => {
    await page.goto("/cart.html");

    await expect(page.locator('[data-test="error"]')).toContainText(
      "You can only access '/cart.html' when you are logged in"
    );
  });

  test("Visiting checkout step one directly without logging in shows an error", async ({ page }) => {
    await page.goto("/checkout-step-one.html");

    await expect(page.locator('[data-test="error"]')).toContainText(
      "You can only access '/checkout-step-one.html' when you are logged in"
    );
  });
});
