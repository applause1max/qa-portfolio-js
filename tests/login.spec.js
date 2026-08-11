const { test, expect } = require ('@playwright/test');
const { assert } = require('node:console');

const STANDARD_USER = 'standard_user';
const LOCKED_OUT_USER = 'locked_out_user';
const PASSWORD = 'secret_sauce';

test('TC-001: Valid login redirects to inventory page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill(STANDARD_USER);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});


test('TC-002: Locked out login shows corresponding error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', {name: 'Username'}).fill(LOCKED_OUT_USER);
    await page.getByRole('textbox', {name: 'Password'}).fill(PASSWORD);
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('locked out')).toBeVisible();
});

test('TC-003: Invalid password shows corresponding error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', {name: 'Username'}).fill(STANDARD_USER);
    await page.getByRole('textbox', {name: 'Password'}).fill('Wrong_password');
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Username and password do not match any user in this service')).toBeVisible();
});

test('TC-004: Empty username show corresponding error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', {name: 'Password'}).fill(PASSWORD);
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Username is required')).toBeVisible();
});

test('TC-005: Invalid login with empty password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', {name: 'Username'}).fill(STANDARD_USER);
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Password is required')).toBeVisible();
});

test('TC-006: Invalid login with empty fields', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('button', {name: "Login"}).click();
    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});