// Shared behaviour for every page: mobile menu, cart badge, product grids.
import { CATEGORIES, PRODUCTS, formatPrice } from './products.js';
import { addItem, getItemCount } from './cart.js';

/* ---------- Mobile navigation ---------- */

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Close the menu after following an in-page link (e.g. #products).
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/* ---------- Cart badge ---------- */

const renderBadge = () => {
  const count = getItemCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
  document.querySelectorAll('.cart-link').forEach((el) => {
    el.setAttribute('aria-label', `Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
  });
};
renderBadge();
document.addEventListener('cart:change', renderBadge);

/* ---------- Toast ---------- */

let toastTimer;
const showToast = (message) => {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.innerHTML = '';
  toast.append(message);
  const link = document.createElement('a');
  link.href = '/cart';
  link.textContent = 'View cart';
  toast.append(link);
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
};

/* ---------- Product grids ---------- */

const productCard = (p) => {
  const article = document.createElement('article');
  article.className = 'product-card';
  article.innerHTML = `
    <div class="product-card__media photo-placeholder">Product photo</div>
    <div class="product-card__body">
      <h3></h3>
      <p></p>
      <div class="product-card__footer">
        <div><span class="price"></span><span class="price-unit"> / kg</span></div>
      </div>
    </div>`;
  article.querySelector('h3').textContent = p.name;
  article.querySelector('p').textContent = p.desc;
  article.querySelector('.price').textContent = formatPrice(p.price);

  if (p.tag) {
    const tag = document.createElement('span');
    tag.className = 'product-card__tag';
    tag.textContent = p.tag;
    article.querySelector('.product-card__media').append(tag);
  }

  const footer = article.querySelector('.product-card__footer');
  if (p.soldOut) {
    const span = document.createElement('span');
    span.className = 'sold-out';
    span.textContent = 'Out of stock';
    footer.append(span);
  } else {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary btn--sm';
    btn.textContent = 'Add';
    btn.setAttribute('aria-label', `Add 1 kg ${p.name} to cart`);
    btn.addEventListener('click', () => {
      addItem(p.id);
      btn.textContent = 'Added ✓';
      btn.classList.add('is-added');
      setTimeout(() => {
        btn.textContent = 'Add';
        btn.classList.remove('is-added');
      }, 1200);
      showToast(`${p.name} (1 kg) added.`);
    });
    footer.append(btn);
  }
  return article;
};

document.querySelectorAll('[data-product-grid]').forEach((grid) => {
  const featuredOnly = grid.dataset.productGrid === 'featured';
  const filterBar = document.querySelector('[data-filters]');
  const searchInput = document.querySelector('[data-shop-search]');
  const countEl = document.querySelector('[data-result-count]');
  const params = new URLSearchParams(location.search);

  let category = CATEGORIES.some((c) => c.id === params.get('category')) ? params.get('category') : 'all';
  let query = params.get('q') || '';
  if (searchInput) searchInput.value = query;

  const syncUrl = () => {
    const next = new URLSearchParams();
    if (category !== 'all') next.set('category', category);
    if (query) next.set('q', query);
    const qs = next.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}`);
  };

  const render = () => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => (featuredOnly ? p.featured : true))
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !q || `${p.name} ${p.desc}`.toLowerCase().includes(q));

    grid.replaceChildren(...list.map(productCard));

    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.gridColumn = '1 / -1';
      empty.innerHTML = '<p>No cuts match your search.</p>';
      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'btn btn--outline btn--sm';
      reset.textContent = 'Show all cuts';
      reset.addEventListener('click', () => {
        category = 'all';
        query = '';
        if (searchInput) searchInput.value = '';
        update();
      });
      empty.append(reset);
      grid.append(empty);
    }

    if (countEl) countEl.textContent = `${list.length} ${list.length === 1 ? 'cut' : 'cuts'}`;
    filterBar?.querySelectorAll('[data-category]').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.category === category));
    });
  };

  const update = () => {
    render();
    if (!featuredOnly) syncUrl();
  };

  if (filterBar && !featuredOnly) {
    filterBar.replaceChildren(
      ...CATEGORIES.map((c) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.category = c.id;
        chip.textContent = c.label;
        chip.addEventListener('click', () => {
          category = c.id;
          update();
        });
        return chip;
      })
    );
  }

  searchInput?.addEventListener('input', () => {
    query = searchInput.value;
    update();
  });
  searchInput?.closest('form')?.addEventListener('submit', (e) => e.preventDefault());

  render();
});
