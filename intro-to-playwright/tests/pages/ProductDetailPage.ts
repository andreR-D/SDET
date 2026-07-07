import { type Page, type Locator, expect } from "@playwright/test";

export class ProductDetailPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('[data-test="inventory-item-name"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.image = page.locator('[data-test="inventory-item"] img');
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.removeButton = page.getByRole("button", { name: "Remove" });
    this.backButton = page.getByRole("button", { name: "Back to products" });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async backToProducts() {
    await this.backButton.click();
  }

  async expectOnDetailPage() {
    await expect(this.page).toHaveURL(/\/inventory-item\.html/);
  }
}
