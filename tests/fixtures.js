const {test, expect} = require('@playwright/test');
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

const myTest = test.extend({
    loggedInPage: async ({page}, use) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByRole('textbox', { name: 'Username' }).fill(STANDARD_USER);
        await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
        await page.getByRole('button', { name: 'Login' }).click();
        await use(page);
    }});

module.exports = { test: myTest, expect };