# Sasi's Market

A fictional, original e-commerce storefront created by Sasi as a portfolio testbed for Playwright. Browse products, search and filter the catalog, manage a cart, validate checkout, and exercise payment outcomes in a safe simulator.

## Run the site

Requirements: Node.js 20+ and npm.

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:4173.

## Run the Playwright suite

```powershell
npx playwright install chromium
npm test
```

Playwright starts Vite automatically. Override `BASE_URL` to test another environment.

## Demo sign-in accounts

| Role | Email | Password |
|---|---|---|
| Customer | `customer@sasis.market` | `shopper-demo` |
| Staff | `staff@sasis.market` | `market-admin-demo` |

The role toggle is on `/login.html`; the staff demo page is `/staff.html`.

## Test-only checkout

Checkout accepts only published dummy card numbers and offers approved, declined, timeout, and unsupported-card scenarios. The cardholder/card fields stay in page memory, are cleared after approval, and are never stored or sent over the network. No payment provider is contacted and no money moves.

| Scenario | Dummy card number |
|---|---|
| Approved | `4242 4242 4242 4242` |
| Declined | `4000 0000 0000 0002` |
| Timeout | `4000 0000 0000 9995` |

Use a future expiry and any three-digit CVC. Do not enter real personal or payment information.

## Authentication limitation

These are public demo credentials. Sign-in is implemented in browser code and uses `sessionStorage` only; it is not secure authentication or access control. Never reuse these credentials or put private data in the staff page.

See [TEST_STRATEGY.md](TEST_STRATEGY.md) for scope and coverage.
