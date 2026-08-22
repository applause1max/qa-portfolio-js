# QA Portfolio (JavaScript / Playwright)

End-to-end test automation for [SauceDemo](https://www.saucedemo.com/), built with Playwright Test (JavaScript) as a conversion of an original Python/Playwright portfolio project, demonstrating equivalent automation coverage in a JavaScript/Node.js stack.

## Tech Stack

- **Playwright Test** (`@playwright/test`) — test runner, assertions, browser automation
- **JavaScript (Node.js)** — plain JS by design; a TypeScript version is planned as a follow-up
- **GitHub Actions** — CI pipeline, runs full suite on every push to `main`
- **Trace-on-failure** — automatic trace capture for any failing test, viewable via Playwright's trace viewer

## Project Structure

```
qa-portfolio-js/
├── tests/
│   ├── fixtures.js       # custom loggedInPage fixture (extends base test)
│   ├── login.spec.js     # TC-001 to TC-006: authentication
│   ├── sorting.spec.js   # TC-007 to TC-011: product sorting/filtering
│   ├── cart.spec.js      # TC-012 to TC-018: shopping cart
│   └── checkout.spec.js  # TC-019 to TC-026: checkout flow
├── playwright.config.js  # browser projects, tracing config
└── .github/workflows/playwright.yml  # CI pipeline
```

## Test Coverage

26 test cases across 4 functional areas. Full test case details (preconditions, steps, expected results, priority) are documented in [`TEST_PLAN.md`](./TEST_PLAN.md).

| Area | Test Cases | Priority Breakdown |
|---|---|---|
| Authentication | TC-001–006 | 3 High, 2 Medium, 1 Low |
| Sorting/Filtering | TC-007–011 | 4 Medium, 1 Low |
| Shopping Cart | TC-012–018 | 4 High, 2 Medium, 1 Low |
| Checkout | TC-019–026 | 6 High, 1 Medium, 1 Low |

Checkout field-validation tests (TC-021/022/023) are consolidated into three parallel tests sharing one pattern (missing first name / last name / zip) rather than fully duplicated code.

## Known Issues Documented

Two real product behaviors were found during test-writing and are documented as expected failures (`test.fail()`) rather than silently ignored or hidden:

- **BUG-001** — Sort order resets to default (Name, A–Z) after navigating to a product detail page and back, instead of persisting the previously selected sort (TC-011).
- **BUG-002** — Checkout can be completed successfully with zero items in the cart; no validation blocks an empty-cart order (TC-020).

## Running the Tests

```bash
npm install
npx playwright install
npx playwright test
```

Run headed (see the browser):
```bash
npx playwright test --headed
```

View the HTML report after a run:
```bash
npx playwright show-report
```

## CI

Every push to `main` triggers the full suite via GitHub Actions (`.github/workflows/playwright.yml`). Test reports are uploaded as artifacts and retained for 30 days.

## Notes on This Conversion

This project was converted line-by-line from an original Python/Playwright (pytest) portfolio to plain JavaScript, including:
- Custom `page` lifecycle and tracing replaced by Playwright Test's built-in `page` fixture and `trace: 'retain-on-failure'` config
- `conftest.py` fixtures rebuilt using `test.extend()`
- `@pytest.mark.xfail` replaced with `test.fail()`
- Python's `sorted()` replaced with JS's `.sort()`, including explicit numeric comparators (`(a, b) => a - b`) to avoid JS's default string-based sort behavior