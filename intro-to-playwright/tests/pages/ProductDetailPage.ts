import { type Page, type Locator, expect } from "@playwright/test";

export class ProductDetailPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('[data-test="inventory-item-name"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.image = page.locator('[data-test="inventory-item"] img');
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
  }

  async expectOnDetailPage() {
    await expect(this.page).toHaveURL(/\/inventory-item\.html/);
  }
}
