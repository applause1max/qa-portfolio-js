import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async removeFirstItem() {
    await this.page.getByRole('button', { name: 'Remove' }).first().click();
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async getItemCount() {
    return await this.page.locator('[data-test="inventory-item"]').count();
  }

  async goToCheckout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}