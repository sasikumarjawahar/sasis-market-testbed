import './style.css';
import './account.css';

type DemoRole = 'customer' | 'staff';

const credentials: Record<DemoRole, { email: string; password: string; label: string }> = {
  customer: { email: 'customer@sasis.market', password: 'shopper-demo', label: 'Customer' },
  staff: { email: 'staff@sasis.market', password: 'market-admin-demo', label: 'Staff' },
};

const app = document.querySelector<HTMLDivElement>('#app')!;
const initialRole: DemoRole = new URLSearchParams(location.search).get('role') === 'staff' ? 'staff' : 'customer';

app.innerHTML = `
  <div class="announcement-bar"><span>Thoughtful finds, packed with care</span><span class="announcement-side">Demo accounts / Sasi's Market</span></div>
  <header class="account-header">
    <a class="wordmark" href="/" aria-label="Sasi's Market home"><span class="wordmark-icon" aria-hidden="true">S</span><span>Sasi's <strong>Market</strong></span></a>
    <a class="account-back" href="/">Back to the store <span aria-hidden="true">↗</span></a>
  </header>
  <main class="account-main">
    <section class="account-story" aria-labelledby="account-title">
      <p class="eyebrow">A small shop for good things</p>
      <h1 id="account-title">A little more<br /><em>personal.</em></h1>
      <p>Use a published demo account to explore the customer or staff experience.</p>
      <div class="account-story-mark" aria-hidden="true">SM<span>·</span>02</div>
    </section>
    <section class="account-panel" aria-labelledby="signin-title">
      <div class="role-switch" role="group" aria-label="Choose sign-in role">
        <button type="button" class="role-option" data-role="customer">Customer</button>
        <button type="button" class="role-option" data-role="staff">Staff</button>
      </div>
      <p class="eyebrow" id="role-eyebrow">Customer demo</p>
      <h2 id="signin-title">Welcome back.</h2>
      <p class="account-intro">Sign in with the sample credentials below.</p>
      <form id="login-form" novalidate>
        <label class="field-label" for="login-username">Email</label>
        <input id="login-username" class="text-input" type="email" autocomplete="username" required />
        <label class="field-label" for="login-password">Password</label>
        <input id="login-password" class="text-input" type="password" autocomplete="current-password" required />
        <button class="checkout-button account-submit" type="submit">Continue as customer <span aria-hidden="true">↗</span></button>
      </form>
      <p id="login-error" class="checkout-message" role="alert" hidden></p>
      <div class="credential-box" aria-live="polite">
        <div class="credential-heading"><span>Published test credentials</span><span class="demo-tag">DEMO</span></div>
        <p><span>Email</span><code id="demo-email"></code></p>
        <p><span>Password</span><code id="demo-password"></code></p>
      </div>
      <p class="security-warning"><strong>Not real authentication.</strong> These public demo credentials and browser-only role checks do not protect accounts or data. Never use a real password here.</p>
    </section>
  </main>
  <footer class="account-footer"><span>Built by Sasi</span><span>© 2026 Sasi's Market</span></footer>
`;

let activeRole: DemoRole = initialRole;
const roleButtons = [...document.querySelectorAll<HTMLButtonElement>('.role-option')];
const usernameInput = document.querySelector<HTMLInputElement>('#login-username')!;
const passwordInput = document.querySelector<HTMLInputElement>('#login-password')!;
const errorMessage = document.querySelector<HTMLParagraphElement>('#login-error')!;
const submitButton = document.querySelector<HTMLButtonElement>('.account-submit')!;

function renderRole(): void {
  const account = credentials[activeRole];
  roleButtons.forEach((button) => {
    const selected = button.dataset.role === activeRole;
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#role-eyebrow')!.textContent = `${account.label} demo`;
  document.querySelector('#signin-title')!.textContent = activeRole === 'customer' ? 'Welcome back.' : 'Staff sign-in.';
  document.querySelector('#demo-email')!.textContent = account.email;
  document.querySelector('#demo-password')!.textContent = account.password;
  submitButton.innerHTML = `Continue as ${activeRole} <span aria-hidden="true">↗</span>`;
  usernameInput.value = account.email;
  passwordInput.value = account.password;
  errorMessage.hidden = true;
}

roleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeRole = button.dataset.role as DemoRole;
    renderRole();
  });
});

document.querySelector<HTMLFormElement>('#login-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  const account = credentials[activeRole];
  if (usernameInput.value.trim().toLowerCase() !== account.email || passwordInput.value !== account.password) {
    errorMessage.textContent = 'Those demo credentials do not match this role.';
    errorMessage.hidden = false;
    return;
  }

  sessionStorage.setItem('sasis-market-demo-role', activeRole);
  sessionStorage.setItem('sasis-market-demo-email', account.email);
  location.assign(activeRole === 'staff' ? '/staff.html' : '/');
});

renderRole();
