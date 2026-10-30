# Sasi's Market E2E Test Strategy

## Purpose

Validate a fictional retail storefront with deterministic catalog data and a no-charge checkout simulator. This is a safe browser automation portfolio project, not a production commerce system.

## Coverage matrix

| Priority | Scenario | Expected result |
|---|---|---|
| P0 | Catalog loads | Products, prices, ratings, and images render with accessible names |
| P0 | Search products | Matching results remain; unmatched text shows an empty state |
| P1 | Filter category | Only products in the selected category are shown |
| P1 | Sort by price | Results order correctly from low to high and high to low |
| P0 | Add/update cart | Quantities, item count, subtotal, shipping, and total update |
| P0 | Checkout validation | Name and email are required; invalid email blocks submission |
| P1 | Dummy card validation | Invalid Luhn number, expired date, or malformed CVC keeps checkout disabled |
| P0 | Approved demo payment | Order confirmation and ID appear; cart resets |
| P1 | Declined, timeout, or unsupported test card | No order is recorded; cart remains available for retry |
| P1 | Remove items | Empty-cart state returns; checkout is disabled |
| P1 | Mobile storefront | Search, product list, and cart controls fit without horizontal overflow |

## Approach

- Use Playwright role-, label-, and text-based locators where practical.
- Give each test an isolated browser context and reset in-memory state on navigation.
- Assert visible outcomes and calculated totals rather than application implementation details.
- Keep catalog fixtures static to make filtering, sorting, and totals deterministic.
- Run Chromium in CI on pushes and pull requests; retain failure artifacts.

## Explicit exclusions

No accounts, backend inventory, server-side cart, payment gateway, refunds, shipping integration, load test, or security certification are implemented. The local simulator recognizes only its documented dummy card numbers. Card-field values are not persisted or sent over the network. Never use real customer data or secrets in this demo.
