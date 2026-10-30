import './style.css';
import './account.css';

const role = sessionStorage.getItem('sasis-market-demo-role');
if (role !== 'staff') {
  location.replace('/login.html?role=staff');
} else {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const email = sessionStorage.getItem('sasis-market-demo-email') || 'staff@sasis.market';

  app.innerHTML = `
    <div class="announcement-bar"><span>Sasi's Market / Staff tools</span><span class="announcement-side">Demo dashboard</span></div>
    <header class="account-header">
      <a class="wordmark" href="/" aria-label="Sasi's Market home"><span class="wordmark-icon" aria-hidden="true">S</span><span>Sasi's <strong>Market</strong></span></a>
      <button id="sign-out" class="account-back" type="button">Sign out <span aria-hidden="true">↗</span></button>
    </header>
    <main class="staff-main">
      <div class="staff-title-row">
        <div><p class="eyebrow">Staff / Overview</p><h1>Good morning, Sasi.</h1><p class="account-intro">A little snapshot of your demo shop.</p></div>
        <span class="signed-in-chip">Signed in as ${email}</span>
      </div>
      <section class="staff-stats" aria-label="Demo shop overview">
        <article><span>Orders today</span><strong>12</strong><small>Demo data</small></article>
        <article><span>Items in catalog</span><strong>06</strong><small>Static fixture</small></article>
        <article><span>Payment mode</span><strong>Sandbox</strong><small>No real transactions</small></article>
      </section>
      <section class="staff-notice"><p class="eyebrow">Testing environment</p><h2>Nothing here is connected to real customers.</h2><p>Sign-in state lives in this browser session. Order metrics are fixed demo values, and the checkout simulator never contacts a payment provider.</p><a class="account-back" href="/">Return to storefront <span aria-hidden="true">↗</span></a></section>
    </main>
    <footer class="account-footer"><span>Built by Sasi</span><span>© 2026 Sasi's Market</span></footer>
  `;

  document.querySelector<HTMLButtonElement>('#sign-out')!.addEventListener('click', () => {
    sessionStorage.removeItem('sasis-market-demo-role');
    sessionStorage.removeItem('sasis-market-demo-email');
    location.assign('/login.html');
  });
}
