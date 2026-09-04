import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillInfo(firstName: string, lastName: string, zip: string) {
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    await this.page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill(zip);
  }

  async continue_() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async cancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async getConfirmationText() {
    return await this.page.locator('[data-test="complete-header"]').textContent();
  }

  async getOrderTotals() {
    const subtotalText = await this.page.locator('[data-test="subtotal-label"]').textContent();
    const taxText = await this.page.locator('[data-test="tax-label"]').textContent();
    const totalText = await this.page.locator('[data-test="total-label"]').textContent();

    const subtotal = parseFloat(subtotalText!.match(/\$([\d.]+)/)![1]);
    const tax = parseFloat(taxText!.match(/\$([\d.]+)/)![1]);
    const total = parseFloat(totalText!.match(/\$([\d.]+)/)![1]);

    return { subtotal, tax, total };
  }
}