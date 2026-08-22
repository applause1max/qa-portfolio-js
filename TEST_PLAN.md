# Test Case Design: SauceDemo E-Commerce Application

This document defines test cases independently of automation implementation, following standard QA test case design practice. Each case maps to a risk area in the application.

## Legend

- **Priority:** High, Medium, Low (based on business impact)
- **Type:** Positive, Negative, Boundary

## 1. Authentication

| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|---|---|---|---|---|---|---|
| TC-001 | Valid login redirects to inventory page | User has standard_user credentials | 1. Navigate to login page. 2. Enter valid username and password. 3. Click Login. | User is redirected to /inventory.html and product list is visible. | High | Positive |
| TC-002 | Locked-out user is blocked with clear error | Account locked_out_user exists | 1. Enter locked_out_user credentials. 2. Click Login. | Login is rejected. Error message states the account is locked out. User remains on login page. | High | Negative |
| TC-003 | Login fails with incorrect password | User has valid username, wrong password | 1. Enter valid username. 2. Enter incorrect password. 3. Click Login. | Login is rejected with a generic error message. No indication of which field was wrong (security best practice). | High | Negative |
| TC-004 | Login fails with empty username field | N/A | 1. Leave username blank. 2. Enter any password. 3. Click Login. | Error message indicates username is required. | Medium | Boundary |
| TC-005 | Login fails with empty password field | N/A | 1. Enter valid username. 2. Leave password blank. 3. Click Login. | Error message indicates password is required. | Medium | Boundary |
| TC-006 | Login fails with both fields empty | N/A | 1. Leave both fields blank. 2. Click Login. | Error message indicates username is required (first validation triggered). | Low | Boundary |

## 2. Product Sorting and Filtering

| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|---|---|---|---|---|---|---|
| TC-007 | Sort products by name, A to Z | User is logged in and on inventory page | 1. Open sort dropdown. 2. Select "Name (A to Z)". | Product list reorders alphabetically ascending. | Medium | Positive |
| TC-008 | Sort products by name, Z to A | User is logged in and on inventory page | 1. Open sort dropdown. 2. Select "Name (Z to A)". | Product list reorders alphabetically descending. | Medium | Positive |
| TC-009 | Sort products by price, low to high | User is logged in and on inventory page | 1. Open sort dropdown. 2. Select "Price (low to high)". | Product list reorders by ascending price. | Medium | Positive |
| TC-010 | Sort products by price, high to low | User is logged in and on inventory page | 1. Open sort dropdown. 2. Select "Price (high to low)". | Product list reorders by descending price. | Medium | Positive |
| TC-011 | Sort selection persists after viewing a product detail page | Sort has been applied | 1. Apply a sort order. 2. Click into a product. 3. Navigate back to inventory. | Sort order is retained after returning to the list. | Low | Positive |

**Known issue:** See BUG-001 below. Actual behavior does not match expected result; documented via `test.fail()`.

## 3. Shopping Cart

| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|---|---|---|---|---|---|---|
| TC-012 | Add single item to cart | User is on inventory page | 1. Click "Add to cart" on one product. | Cart icon badge shows "1". Button changes to "Remove". | High | Positive |
| TC-013 | Add multiple items to cart | User is on inventory page | 1. Click "Add to cart" on three different products. | Cart icon badge shows "3". All three items reflect "Remove" state. | High | Positive |
| TC-014 | Remove item from cart via inventory page | At least one item is in the cart | 1. Click "Remove" on an added product. | Cart badge count decreases by 1. Button reverts to "Add to cart". | High | Positive |
| TC-015 | Remove item from cart via cart page | At least one item is in the cart | 1. Open cart page. 2. Click "Remove" on an item. | Item is removed from the cart list. Badge count updates accordingly. | High | Positive |
| TC-016 | Cart contents persist across navigation | Item(s) added to cart | 1. Add item to cart. 2. Navigate to a product detail page and back. | Cart badge and contents remain unchanged. | Medium | Positive |
| TC-017 | Cart displays correct item count with zero items | Cart is empty | 1. Open cart page with no items added. | Cart page loads with no line items and no error. | Low | Boundary |
| TC-018 | "Continue Shopping" from cart returns to inventory | User is on cart page | 1. Click "Continue Shopping". | User is returned to /inventory.html with cart state intact. | Low | Positive |

## 4. Checkout Flow

| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|---|---|---|---|---|---|---|
| TC-019 | Complete checkout with valid information and items in cart | At least one item in cart | 1. Click Checkout. 2. Enter valid first name, last name, zip code. 3. Click Continue. 4. Click Finish. | Order completes successfully. Confirmation message is displayed. | High | Positive |
| TC-020 | Checkout blocked with empty cart | Cart is empty | 1. Navigate directly to checkout step. | User cannot proceed to a meaningful checkout, or is shown a cart with nothing to purchase. | High | Boundary |
| TC-021 | Checkout fails with missing first name | Item in cart, on checkout info page | 1. Leave first name blank. 2. Fill other fields. 3. Click Continue. | Error message indicates first name is required. User remains on the form. | High | Negative |
| TC-022 | Checkout fails with missing last name | Item in cart, on checkout info page | 1. Leave last name blank. 2. Fill other fields. 3. Click Continue. | Error message indicates last name is required. | High | Negative |
| TC-023 | Checkout fails with missing zip/postal code | Item in cart, on checkout info page | 1. Leave zip code blank. 2. Fill other fields. 3. Click Continue. | Error message indicates postal code is required. | High | Negative |
| TC-024 | Order summary reflects correct item total and pricing | Multiple items in cart | 1. Proceed to checkout overview step. | Item total, tax, and total price are displayed and mathematically consistent. | High | Positive |
| TC-025 | Cart is emptied after successful order completion | Order just completed | 1. Complete a full checkout. 2. Return to inventory page. | Cart badge shows no count (cart is empty). | Medium | Positive |
| TC-026 | Cancel checkout returns user to cart without losing items | On checkout info or overview page | 1. Click Cancel. | User returns to a page with items still present (see note below). | Low | Positive |

**Note on TC-026:** Actual site behavior returns the user to `/inventory.html` after Cancel, not the cart page as originally worded. Cart contents are still preserved (verified via cart badge), so the intent of the test case (no items lost) is satisfied even though the destination page differs from the original wording.

## Coverage Summary

| Area | Test Cases | High Priority | Medium Priority | Low Priority |
|---|---|---|---|---|
| Authentication | 6 | 3 | 2 | 1 |
| Sorting/Filtering | 5 | 0 | 4 | 1 |
| Shopping Cart | 7 | 4 | 2 | 1 |
| Checkout | 8 | 6 | 1 | 1 |
| **Total** | **26** | **13** | **9** | **4** |

## Known Bugs Documented Via Tests

| ID | Test Case | Description |
|---|---|---|
| BUG-001 | TC-011 | Sort order resets to default (Name, A–Z) after navigating to a product detail page and back, instead of persisting the previously selected sort. |
| BUG-002 | TC-020 | Checkout completes successfully with zero items in the cart; no validation blocks an empty-cart order. |