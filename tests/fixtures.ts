import {test, expect, Page} from '@playwright/test';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

const myTest = test.extend<{ loggedInPage: Page }>({
        loggedInPage: async ({page}, use) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByRole('textbox', { name: 'Username' }).fill(STANDARD_USER);
        await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
        await page.getByRole('button', { name: 'Login' }).click();
        await use(page);
    }
});

export { myTest as test, expect };