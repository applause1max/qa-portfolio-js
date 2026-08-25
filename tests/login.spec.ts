import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { log } from 'node:console';

const STANDARD_USER = 'standard_user';
const LOCKED_OUT_USER = 'locked_out_user';
const PASSWORD = 'secret_sauce';

test('TC-001: Valid login redirects to inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, PASSWORD);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});


test('TC-002: Locked out login shows corresponding error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USER, PASSWORD);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('locked out')).toBeVisible();
});

test('TC-003: Invalid password shows corresponding error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USER,'Wrong_password');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Username and password do not match any user in this service')).toBeVisible();
});

test('TC-004: Empty username show corresponding error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("", PASSWORD);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Username is required')).toBeVisible();
});

test('TC-005: Invalid login with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, "");
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByText('Password is required')).toBeVisible();
});

test('TC-006: Invalid login with empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("","");
    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});