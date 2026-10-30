import { products, type Product } from './products';
import {
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  processSandboxPayment,
} from './mock-payment-gateway';
import './style.css';

const cart = new Map<string, number>();
const shippingThreshold = 7500;
const shippingFee = 695;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="announcement-bar">
    <span>Thoughtful finds, packed with care</span>
    <span class="announcement-side">Free shipping over $75 <span aria-hidden="true">✳</span></span>
  </div>
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Sasi's Market home">
      <span class="wordmark-icon" aria-hidden="true">S</span>
      <span>Sasi's <strong>Market</strong></span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="#catalog">Discover</a>
      <a href="#checkout">Checkout</a>
      <a href="#about">About</a>
    </nav>
    <a class="bag-link" href="#checkout" aria-label="Shopping bag, 0 items">
      <span aria-hidden="true">Bag</span><span class="bag-count" id="header-cart-count">0</span>
    </a>
  </header>

  <main id="top">
    <section class="intro-band" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">A small shop for good things</p>
        <h1 id="page-title">Good finds,<br /><em>everyday.</em></h1>
      </div>
      <p class="intro-note">Useful objects, considered details, and a few things that simply make the day better.</p>
      <div class="intro-mark" aria-hidden="true">SM<span>·</span>01</div>
    </section>

    <section id="catalog" class="catalog-section" aria-labelledby="catalog-title">
      <div class="catalog-topline">
        <div>
          <p class="eyebrow">The edit / 06 objects</p>
          <h2 id="catalog-title">Shop the collection</h2>
        </div>
        <p id="result-count" class="result-count" aria-live="polite">6 items</p>
      </div>
      <div class="catalog-toolbar">
        <label class="search-field">
          <span class="search-icon" aria-hidden="true">⌕</span>
          <span class="sr-only">Search products</span>
          <input id="product-search" type="search" placeholder="Search the collection" autocomplete="off" />
        </label>
        <label class="select-field">
          <span class="sr-only">Filter by category</span>
          <select id="category-filter" aria-label="Filter by category">
            <option value="all">All departments</option>
            <option value="Tech">Tech</option>
            <option value="Home">Home</option>
            <option value="Style">Style</option>
          </select>
        </label>
        <label class="select-field sort-field">
          <span class="sr-only">Sort products</span>
          <select id="sort-products" aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div id="product-grid" class="product-grid" aria-live="polite"></div>
      <p id="empty-results" class="empty-results" hidden>No finds match that search. Try another word or department.</p>
    </section>

    <section id="checkout" class="checkout-section" aria-labelledby="checkout-title">
      <div class="checkout-heading">
        <div>
          <p class="eyebrow">Your selection</p>
          <h2 id="checkout-title">The bag</h2>
        </div>
        <span id="checkout-item-count" class="checkout-count">0 items</span>
      </div>
      <div class="checkout-columns">
        <div class="cart-panel" aria-live="polite">
          <div id="cart-items" class="cart-items">
            <p class="empty-cart">Your bag is waiting for its first find.</p>
          </div>
        </div>
        <div class="checkout-panel">
          <div class="shipping-note" id="shipping-note">Add <strong>$75.00</strong> for complimentary shipping.</div>
          <div class="totals-row"><span>Subtotal</span><strong id="cart-subtotal">$0.00</strong></div>
          <div class="totals-row"><span>Shipping</span><strong id="shipping-cost">$0.00</strong></div>
          <div class="totals-row total-row"><span>Total</span><strong id="cart-total">$0.00</strong></div>
          <form id="checkout-form" novalidate>
            <label class="field-label" for="customer-name">Name</label>
            <input id="customer-name" class="text-input" name="name" autocomplete="name" placeholder="Your name" required />
            <label class="field-label" for="customer-email">Email</label>
            <input id="customer-email" class="text-input" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            <label class="field-label" for="card-type">Card type</label>
            <select id="card-type" class="text-input">
              <option value="credit">Credit card</option>
              <option value="debit">Debit card</option>
            </select>
            <label class="field-label" for="cardholder-name">Name on card</label>
            <input id="cardholder-name" class="text-input" autocomplete="cc-name" placeholder="Name on card" required />
            <label class="field-label" for="card-number">Dummy card number</label>
            <input id="card-number" class="text-input" inputmode="numeric" autocomplete="cc-number" maxlength="23" placeholder="4242 4242 4242 4242" required />
            <div class="payment-fields-row">
              <div>
                <label class="field-label" for="card-expiry">Expiry (MM/YY)</label>
                <input id="card-expiry" class="text-input" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="12/30" required />
              </div>
              <div>
                <label class="field-label" for="card-cvc">CVC</label>
                <input id="card-cvc" class="text-input" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="123" required />
              </div>
            </div>
            <details class="sandbox-cards">
              <summary>Dummy test cards</summary>
              <ul>
                <li>Approved: <code>4242 4242 4242 4242</code></li>
                <li>Declined: <code>4000 0000 0000 0002</code></li>
                <li>Timeout: <code>4000 0000 0000 9995</code></li>
              </ul>
              <p>Use a future expiry and a 3-digit CVC. Local simulation only.</p>
            </details>
            <p class="demo-disclaimer">Test checkout only. No card details, payment provider, or real charge.</p>
            <button id="place-order" class="checkout-button" type="submit" disabled>Complete demo order <span aria-hidden="true">↗</span></button>
          </form>
          <p id="checkout-message" class="checkout-message" role="status" aria-live="polite" hidden></p>
          <section id="order-confirmation" class="order-confirmation" aria-live="polite" hidden>
            <p class="eyebrow">Order confirmed / demo</p>
            <h3>Lovely choice.</h3>
            <p>Your test order is ready.</p>
            <p>Order ID <strong id="confirmation-id"></strong></p>
            <p>Test transaction <strong id="transaction-id"></strong></p>
            <p>Method <strong id="payment-method-result"></strong></p>
            <button id="continue-shopping" class="text-button" type="button">Continue browsing</button>
          </section>
        </div>
      </div>
    </section>
  </main>

  <footer id="about" class="site-footer">
    <a class="wordmark footer-mark" href="#top"><span class="wordmark-icon" aria-hidden="true">S</span><span>Sasi's <strong>Market</strong></span></a>
    <p>A fictional storefront built for commerce testing practice.</p>
    <span class="builder-credit">Built by Sasi</span>
    <span class="copyright">© 2026 Sasi's Market</span>
  </footer>
`;

const grid = document.querySelector<HTMLDivElement>('#product-grid')!;
const searchInput = document.querySelector<HTMLInputElement>('#product-search')!;
const categoryFilter = document.querySelector<HTMLSelectElement>('#category-filter')!;
const sortSelect = document.querySelector<HTMLSelectElement>('#sort-products')!;
const cartItems = document.querySelector<HTMLDivElement>('#cart-items')!;
const customerName = document.querySelector<HTMLInputElement>('#customer-name')!;
const customerEmail = document.querySelector<HTMLInputElement>('#customer-email')!;
const cardType = document.querySelector<HTMLSelectElement>('#card-type')!;
const cardholderName = document.querySelector<HTMLInputElement>('#cardholder-name')!;
const cardNumber = document.querySelector<HTMLInputElement>('#card-number')!;
const cardExpiry = document.querySelector<HTMLInputElement>('#card-expiry')!;
const cardCvc = document.querySelector<HTMLInputElement>('#card-cvc')!;
const placeOrderButton = document.querySelector<HTMLButtonElement>('#place-order')!;
const checkoutMessage = document.querySelector<HTMLParagraphElement>('#checkout-message')!;
const confirmation = document.querySelector<HTMLElement>('#order-confirmation')!;

function formatPrice(cents: number): string {
  return money.format(cents / 100);
}

function visibleProducts(): Product[] {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
    return matchesQuery && (category === 'all' || product.category === category);
  });

  switch (sortSelect.value) {
    case 'price-low':
      return filtered.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-high':
      return filtered.sort((a, b) => b.priceCents - a.priceCents);
    case 'name':
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return filtered.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

function renderCatalog(): void {
  const matches = visibleProducts();
  document.querySelector('#result-count')!.textContent = `${matches.length} ${matches.length === 1 ? 'item' : 'items'}`;
  document.querySelector('#empty-results')!.toggleAttribute('hidden', matches.length > 0);
  grid.innerHTML = matches.map((product) => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.imageUrl}" alt="${product.imageAlt}" loading="lazy" />
        <span class="product-category">${product.category}</span>
      </div>
      <div class="product-copy">
        <div class="product-meta"><span class="product-rating" aria-label="Rated ${product.rating} out of 5">★ ${product.rating}</span><span class="product-price">${formatPrice(product.priceCents)}</span></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <button class="add-button" type="button" data-action="add" aria-label="Add ${product.name} to bag">Add to bag <span aria-hidden="true">+</span></button>
      </div>
    </article>
  `).join('');
}

function totals() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id)!;
    return sum + product.priceCents * quantity;
  }, 0);
  const shipping = count === 0 || subtotal >= shippingThreshold ? 0 : shippingFee;
  return { count, subtotal, shipping, total: subtotal + shipping };
}

function renderCart(): void {
  const { count, subtotal, shipping, total } = totals();
  document.querySelector('#header-cart-count')!.textContent = String(count);
  document.querySelector('.bag-link')!.setAttribute('aria-label', `Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  document.querySelector('#checkout-item-count')!.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  document.querySelector('#cart-subtotal')!.textContent = formatPrice(subtotal);
  document.querySelector('#shipping-cost')!.textContent = shipping === 0 && count > 0 ? 'Complimentary' : formatPrice(shipping);
  document.querySelector('#cart-total')!.textContent = formatPrice(total);

  const remaining = Math.max(0, shippingThreshold - subtotal);
  document.querySelector('#shipping-note')!.innerHTML = count === 0
    ? 'Complimentary shipping on orders over <strong>$75.00</strong>.'
    : remaining === 0
      ? 'Complimentary shipping unlocked.'
      : `Add <strong>${formatPrice(remaining)}</strong> for complimentary shipping.`;

  cartItems.innerHTML = count === 0
    ? '<p class="empty-cart">Your bag is waiting for its first find.</p>'
    : [...cart.entries()].map(([id, quantity]) => {
        const product = products.find((item) => item.id === id)!;
        return `
          <article class="cart-line" data-cart-id="${product.id}">
            <img src="${product.imageUrl}" alt="" />
            <div class="cart-line-copy"><h3>${product.name}</h3><span>${formatPrice(product.priceCents)}</span>
              <div class="quantity-control" aria-label="${product.name} quantity">
                <button type="button" data-action="decrease" aria-label="Decrease ${product.name} quantity">−</button>
                <span data-testid="quantity-${product.id}">${quantity}</span>
                <button type="button" data-action="increase" aria-label="Increase ${product.name} quantity">+</button>
              </div>
            </div>
            <button class="remove-button" type="button" data-action="remove" aria-label="Remove ${product.name}">Remove</button>
          </article>
        `;
      }).join('');

  updateCheckoutValidity();
}

grid.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action="add"]');
  if (!button) return;
  const productId = button.closest<HTMLElement>('[data-product-id]')!.dataset.productId!;
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
  button.textContent = 'Added';
  window.setTimeout(() => {
    if (button.isConnected) button.innerHTML = 'Add to bag <span aria-hidden="true">+</span>';
  }, 850);
});

cartItems.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
  if (!button) return;
  const cartLine = button.closest<HTMLElement>('[data-cart-id]')!;
  const productId = cartLine.dataset.cartId!;
  const quantity = cart.get(productId) || 0;

  if (button.dataset.action === 'remove' || (button.dataset.action === 'decrease' && quantity <= 1)) {
    cart.delete(productId);
  } else if (button.dataset.action === 'decrease') {
    cart.set(productId, quantity - 1);
  } else {
    cart.set(productId, quantity + 1);
  }
  renderCart();
});

searchInput.addEventListener('input', renderCatalog);
categoryFilter.addEventListener('change', renderCatalog);
sortSelect.addEventListener('change', renderCatalog);

customerName.addEventListener('input', updateCheckoutValidity);
customerEmail.addEventListener('input', updateCheckoutValidity);
cardholderName.addEventListener('input', updateCheckoutValidity);
cardNumber.addEventListener('input', updateCheckoutValidity);
cardExpiry.addEventListener('input', updateCheckoutValidity);
cardCvc.addEventListener('input', updateCheckoutValidity);
cardType.addEventListener('change', updateCheckoutValidity);

function updateCheckoutValidity(): void {
  const hasCart = totals().count > 0;
  const validFields = customerName.value.trim().length > 0
    && customerEmail.validity.valid
    && customerEmail.value.trim().length > 0
    && cardholderName.value.trim().length > 0
    && isValidCardNumber(cardNumber.value)
    && isValidExpiry(cardExpiry.value)
    && isValidCvc(cardCvc.value);
  placeOrderButton.disabled = !hasCart || !validFields;
}

function showCheckoutMessage(message: string, type: 'error' | 'success'): void {
  checkoutMessage.textContent = message;
  checkoutMessage.dataset.type = type;
  checkoutMessage.hidden = false;
}

document.querySelector<HTMLFormElement>('#checkout-form')!.addEventListener('submit', async (event) => {
  event.preventDefault();
  updateCheckoutValidity();
  if (placeOrderButton.disabled) {
    showCheckoutMessage('Add an item and enter a valid name and email to continue.', 'error');
    return;
  }

  const { count, total } = totals();
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = 'Processing test payment...';
  const payment = await processSandboxPayment({
    cardNumber: cardNumber.value,
    cardType: cardType.value as 'credit' | 'debit',
    amountCents: total,
  });

  if (payment.status !== 'approved') {
    showCheckoutMessage(payment.message, 'error');
    placeOrderButton.textContent = 'Complete demo order';
    updateCheckoutValidity();
    return;
  }

  const orderId = `SM-${Date.now().toString().slice(-8)}`;
  document.querySelector('#confirmation-id')!.textContent = orderId;
  document.querySelector('#transaction-id')!.textContent = payment.transactionId;
  document.querySelector('#payment-method-result')!.textContent = `Demo ${payment.cardType} card`;
  confirmation.hidden = false;
  showCheckoutMessage(`Sandbox payment approved. ${count} ${count === 1 ? 'item' : 'items'} confirmed for ${formatPrice(total)}; no charge was made.`, 'success');
  cart.clear();
  renderCart();
  customerName.value = '';
  customerEmail.value = '';
  cardType.value = 'credit';
  cardholderName.value = '';
  cardNumber.value = '';
  cardExpiry.value = '';
  cardCvc.value = '';
  placeOrderButton.textContent = 'Complete demo order';
  updateCheckoutValidity();
});

document.querySelector<HTMLButtonElement>('#continue-shopping')!.addEventListener('click', () => {
  confirmation.hidden = true;
  document.querySelector('#catalog')!.scrollIntoView({ behavior: 'smooth' });
});

renderCatalog();
renderCart();
