/**
 * PIRATO shop logic.
 * Cart state persists in localStorage under 'pirato_bag'.
 * Checkout is handled entirely by Stripe Payment Links — no backend,
 * no keys in this file. See data/products.js for setup instructions.
 */

const BAG_KEY = 'pirato_bag';

function getBag() {
  try {
    return JSON.parse(localStorage.getItem(BAG_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveBag(bag) {
  localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  renderBag();
}

function addToBag(productId, size, qty = 1) {
  const bag = getBag();
  const existing = bag.find(i => i.productId === productId && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    bag.push({ productId, size, qty });
  }
  saveBag(bag);
  openDrawer();
}

function updateQty(productId, size, delta) {
  const bag = getBag();
  const item = bag.find(i => i.productId === productId && i.size === size);
  if (!item) return;
  item.qty += delta;
  const next = item.qty <= 0 ? bag.filter(i => !(i.productId === productId && i.size === size)) : bag;
  saveBag(next);
}

function removeFromBag(productId, size) {
  const bag = getBag().filter(i => !(i.productId === productId && i.size === size));
  saveBag(bag);
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* ---------- Product grid ---------- */
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="thumb">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        <div class="quickview">Quick View</div>
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <span class="price">$${p.price}</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

/* ---------- Quick view modal ---------- */
let activeProduct = null;
let activeImageIndex = 0;
let activeSize = null;

function openModal(productId) {
  const p = findProduct(productId);
  if (!p) return;
  activeProduct = p;
  activeImageIndex = 0;
  activeSize = p.sizes[0];
  renderModal();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderModal() {
  const p = activeProduct;
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-gallery">
      <div class="main-img">
        <img id="modalMainImg" src="${p.images[activeImageIndex]}" alt="${p.name}">
      </div>
      ${p.images.length > 1 ? `
        <div class="modal-thumbs">
          ${p.images.map((img, i) => `
            <button data-idx="${i}" class="${i === activeImageIndex ? 'active' : ''}">
              <img src="${img}" alt="${p.name} view ${i + 1}">
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>
    <div class="modal-details">
      <span class="eyebrow">Pirato</span>
      <h2 id="modalTitle">${p.name}</h2>
      <div class="price">$${p.price}</div>
      <p class="desc">${p.description}</p>
      <span class="size-label">Size</span>
      <div class="size-grid">
        ${p.sizes.map(s => `<button data-size="${s}" class="${s === activeSize ? 'active' : ''}">${s}</button>`).join('')}
      </div>
      <div class="modal-actions">
        <button class="btn-solid" id="addToBagBtn">Add To Bag</button>
        <a class="btn-outline" id="buyNowBtn" href="${p.stripeLink}" target="_blank" rel="noopener">Buy Now — Stripe Checkout</a>
        <span class="modal-hint">Buy Now opens a secure Stripe checkout in a new tab.</span>
      </div>
    </div>
  `;

  body.querySelectorAll('.modal-thumbs button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeImageIndex = Number(btn.dataset.idx);
      renderModal();
    });
  });
  body.querySelectorAll('.size-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSize = btn.dataset.size;
      renderModal();
    });
  });
  document.getElementById('addToBagBtn').addEventListener('click', () => {
    addToBag(p.id, activeSize, 1);
    closeModal();
  });
}

/* ---------- Bag / cart drawer ---------- */
function openDrawer() {
  document.getElementById('bagDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('bagDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderBag() {
  const bag = getBag();
  const itemsEl = document.getElementById('bagItems');
  const countEl = document.getElementById('bagCount');
  const subtotalEl = document.getElementById('bagSubtotal');
  const checkoutListEl = document.getElementById('bagCheckoutList');
  if (!itemsEl) return;

  const totalQty = bag.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = totalQty;

  if (bag.length === 0) {
    itemsEl.innerHTML = '<p class="bag-empty">Your bag is empty. Go find something built different.</p>';
    subtotalEl.textContent = '$0';
    checkoutListEl.innerHTML = '';
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = bag.map(item => {
    const p = findProduct(item.productId);
    if (!p) return '';
    subtotal += p.price * item.qty;
    return `
      <div class="bag-item">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="bag-item-info">
          <h4>${p.name}</h4>
          <span class="meta">Size ${item.size}</span>
          <div class="bag-item-row">
            <div class="qty-control">
              <button data-action="dec" data-id="${p.id}" data-size="${item.size}">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${p.id}" data-size="${item.size}">+</button>
            </div>
            <span class="price">$${p.price * item.qty}</span>
          </div>
          <button class="remove-item" data-action="remove" data-id="${p.id}" data-size="${item.size}">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = `$${subtotal}`;

  // one checkout button per unique product in the bag (Stripe Payment Links
  // are single-product, so this is the honest real-checkout path)
  const uniqueProducts = [...new Set(bag.map(i => i.productId))];
  checkoutListEl.innerHTML = uniqueProducts.map(id => {
    const p = findProduct(id);
    const qty = bag.filter(i => i.productId === id).reduce((s, i) => s + i.qty, 0);
    return `
      <div class="checkout-line">
        <span>${p.name} (${qty})</span>
        <a class="btn-solid" href="${p.stripeLink}" target="_blank" rel="noopener">Pay</a>
      </div>
    `;
  }).join('');

  itemsEl.querySelectorAll('button[data-action]').forEach(btn => {
    const { action, id, size } = btn.dataset;
    btn.addEventListener('click', () => {
      if (action === 'inc') updateQty(id, size, 1);
      if (action === 'dec') updateQty(id, size, -1);
      if (action === 'remove') removeFromBag(id, size);
    });
  });
}

/* ---------- Wire up global listeners ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid();
  renderBag();

  document.getElementById('bagToggle')?.addEventListener('click', openDrawer);
  document.getElementById('bagClose')?.addEventListener('click', closeDrawer);
  document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawer);

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDrawer(); }
  });
});
