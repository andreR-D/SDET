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
});
