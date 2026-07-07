import { type Page, type Locator, expect } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly itemPrices: Locator;
  readonly itemNames: Locator;
  readonly menuButton: Locator;
  readonly resetStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.getByRole("combobox");
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.menuButton = page.getByRole("button", { name: "Open Menu" });
    this.resetStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetStateLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  item(productName: string): Locator {
    return this.page.locator('[data-test="inventory-item"]', { hasText: productName });
  }

  async addToCart(productName: string) {
    await this.item(productName).getByRole("button", { name: "Add to cart" }).click();
  }

  async addProduct(productName: string): Promise<number> {
    await this.addToCart(productName);
    const priceText = await this.item(productName).locator('[data-test="inventory-item-price"]').innerText();
    return parseFloat(priceText.replace("$", ""));
  }

  async removeFromCart(productName: string) {
    await this.item(productName).getByRole("button", { name: "Remove" }).click();
  }

  async openProduct(productName: string) {
    await this.item(productName).getByRole("link", { name: productName }).last().click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }

  async expectCartBadgeCount(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async expectOnInventoryPage() {
    await expect(this.page).toHaveURL(/\/inventory/);
  }
}
