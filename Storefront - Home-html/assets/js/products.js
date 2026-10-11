// Product catalogue. Prices are in rupees per kg.
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'curry-cut', label: 'Curry cut' },
  { id: 'boneless', label: 'Boneless' },
  { id: 'legs-wings', label: 'Legs and wings' },
  { id: 'whole', label: 'Whole bird' },
  { id: 'mince-offal', label: 'Mince and offal' },
];

export const PRODUCTS = [
  { id: 'curry-cut', name: 'Curry Cut', desc: 'Bone-in pieces for gravies and biryani.', price: 220, tag: 'Bestseller', category: 'curry-cut', soldOut: false, featured: true },
  { id: 'boneless-breast', name: 'Boneless Breast', desc: 'Lean, trimmed and ready to cook.', price: 320, tag: '', category: 'boneless', soldOut: false, featured: true },
  { id: 'drumsticks', name: 'Drumsticks', desc: 'Skinless legs for grilling and frying.', price: 260, tag: '', category: 'legs-wings', soldOut: false, featured: true },
  { id: 'chicken-wings', name: 'Chicken Wings', desc: 'Whole wings, cleaned and cut.', price: 240, tag: 'New', category: 'legs-wings', soldOut: false, featured: true },
  { id: 'whole-chicken', name: 'Whole Chicken', desc: 'Skinless, cleaned and ready to roast.', price: 230, tag: '', category: 'whole', soldOut: false, featured: false },
  { id: 'chicken-keema', name: 'Chicken Keema', desc: 'Freshly minced for kebabs and curries.', price: 340, tag: '', category: 'mince-offal', soldOut: false, featured: false },
  { id: 'liver-gizzard', name: 'Liver and Gizzard', desc: 'Cleaned offal for classic home recipes.', price: 160, tag: '', category: 'mince-offal', soldOut: true, featured: false },
  { id: 'country-chicken', name: 'Country Chicken', desc: 'Firm texture with a deeper flavour.', price: 420, tag: 'Limited', category: 'whole', soldOut: false, featured: false },
];

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

const rupees = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
export const formatPrice = (amount) => `₹ ${rupees.format(Math.round(amount))}`;
export const formatWeight = (kg) => `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`;
