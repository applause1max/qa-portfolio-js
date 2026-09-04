import { Page } from "@playwright/test";

export class InventoryPage {
    constructor(private page: Page) {}

    async sortBy(option: string) {
      await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
    }

    async getProductNames() {
      return await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

    async getProductPrices() {
      const pricing = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
      const prices: number[] = [];
      for (const price of pricing) {
        const cleanPrice = price.replace('$', '');
        const number = parseFloat(cleanPrice);
        prices.push(number);
    }
      return prices;
  }

    async addToCartByIndex(index: number) {
      const addButtons = await this.page.getByRole('button', { name: 'Add to cart' }).all();
      await addButtons[index].click();
  }

    async getCartBadgeCount() {
    return await this.page.locator('[data-test="shopping-cart-badge"]').textContent();
  }
}
