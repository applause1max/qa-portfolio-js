const {test, expect} = require('./fixtures');

test('TC-007: Verify sorting in ascending order', async ({ loggedInPage }) => {
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('az');
    const products = await loggedInPage.locator('[data-test="inventory-item-name"]').allTextContents();
    
    expect(products).toEqual([...products].sort());
});

test('TC-008: Verify sorting in descending order', async ({ loggedInPage }) => {
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('za');
    const products =  await loggedInPage.locator('[data-test="inventory-item-name"]').allTextContents();

    expect(products).toEqual([...products].sort().reverse());
});

test('TC-009: Verify sorting from lowest price', async ({ loggedInPage }) => {
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const pricing = await loggedInPage.locator('[data-test="inventory-item-price"]').allTextContents();
    
    const prices = [];
    for (const price of pricing) {
        const cleanPrice = price.replace('$', '');
        const number = parseFloat(cleanPrice);
        prices.push(number);
    }

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('TC-010: Verify sorting from highest price', async ({ loggedInPage }) => {
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const pricing = await loggedInPage.locator('[data-test="inventory-item-price"]').allTextContents();

    const prices = [];
    for (const price of pricing) {
        const cleanPrice = price.replace('$', '');
        const number = parseFloat(cleanPrice);
        prices.push(number);
    }
    
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('TC-011: Verify sorting applied when navigating back from product page', async ({ loggedInPage }) => {
    test.fail();
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await loggedInPage.locator('[data-test="inventory-item-name"]').first().click();
    await loggedInPage.getByRole('button', {name: "Back to Products"}).click();

    const pricing = await loggedInPage.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = [];
    for (const price of pricing) {
        const cleanPrice = price.replace('$', '');
        const number = parseFloat(cleanPrice);
        prices.push(number);
    }

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
});