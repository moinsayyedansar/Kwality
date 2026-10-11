// Cart kept in the visitor's browser (localStorage) so it survives page loads.
// Quantities are weights in kg, adjusted in 0.5 kg steps.
import { findProduct } from './products.js';

const STORAGE_KEY = 'kwality-cart';
export const STEP_KG = 0.5;
export const DEFAULT_KG = 1;
export const DELIVERY_FEE = 40;

const read = () => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(items) ? items.filter((i) => findProduct(i.id) && i.qty > 0) : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (e.g. private mode) — the cart just won't persist.
  }
  document.dispatchEvent(new CustomEvent('cart:change'));
};

export const getItems = () =>
  read().map((i) => ({ ...findProduct(i.id), qty: i.qty }));

export const getItemCount = () => read().length;

export const addItem = (id, qty = DEFAULT_KG) => {
  const items = read();
  const existing = items.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else items.push({ id, qty });
  write(items);
};

export const setQty = (id, qty) => {
  const items = read();
  const rounded = Math.round(qty / STEP_KG) * STEP_KG;
  write(rounded > 0 ? items.map((i) => (i.id === id ? { ...i, qty: rounded } : i)) : items.filter((i) => i.id !== id));
};

export const removeItem = (id) => write(read().filter((i) => i.id !== id));

export const clearCart = () => write([]);

export const getSubtotal = () => getItems().reduce((sum, i) => sum + i.price * i.qty, 0);

// Keep cart storage in sync across open tabs.
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) document.dispatchEvent(new CustomEvent('cart:change'));
});
