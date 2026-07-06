import { type Page, type Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly itemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.postalCodeInput = page.getByRole("textbox", { name: "Zip/Postal Code" });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.errorMessage = page.locator('[data-test="error"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectOnStepOne() {
    await expect(this.page).toHaveURL(/\/checkout-step-one/);
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }

  async expectOnStepTwo() {
    await expect(this.page).toHaveURL(/\/checkout-step-two/);
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
  }

  async expectOnComplete() {
    await expect(this.page).toHaveURL(/\/checkout-complete/);
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async checkOrderSummary() {
    const itemNames = await this.itemNames.allTextContents();
    console.log("Items in order:", itemNames);

    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    console.log("Subtotal:", subtotalText);
    console.log("Tax:", taxText);
    console.log("Total:", totalText);
  }

  async checkItemNames(expectedNames: string[]) {
    const actualNames = await this.itemNames.allTextContents();
    expect(actualNames).toEqual(expectedNames);
  }
  
  async checkTotal(expectedSubtotal?: number) {
    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    const subtotal = parseFloat(subtotalText.replace("Item total: $", ""));
    const tax = parseFloat(taxText.replace("Tax: $", ""));
    const total = parseFloat(totalText.replace("Total: $", ""));

    if (expectedSubtotal !== undefined) {
      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    }

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }
}
