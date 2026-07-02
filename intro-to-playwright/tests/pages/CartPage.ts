import { type Page, type Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });
  }

  itemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  async removeItem() {
    await this.page.getByRole("button", { name: "Remove" }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async expectOnCartPage() {
    await expect(this.page).toHaveURL(/\/cart/);
    await expect(this.pageTitle).toHaveText("Your Cart");
  }
}
