// ---- data access helpers ----
const LS_KEY = "tinyshop_products";

function getProducts() {
  const raw = localStorage.getItem(LS_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveProducts(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function seedIfEmpty() {
  const existing = getProducts();
  if (existing.length) return;
  const seed = [
    {
      id: crypto.randomUUID(),
      name: "Minimal Mug",
      price: 39.9,
      image: "https://picsum.photos/seed/mug/600/400",
      description: "Stoneware mug with a matte finish."
    },
    {
      id: crypto.randomUUID(),
      name: "Canvas Tote",
      price: 59.0,
      image: "https://picsum.photos/seed/tote/600/400",
      description: "Reusable everyday tote with reinforced handles."
    },
    {
      id: crypto.randomUUID(),
      name: "Desk Lamp",
      price: 129.0,
      image: "https://picsum.photos/seed/lamp/600/400",
      description: "Adjustable lamp for cozy workspace lighting."
    }
  ];
  saveProducts(seed);
}

// ---- UI render ----
function money(n){ return new Intl.NumberFormat('en-MY', {style:'currency', currency:'MYR'}).format(n); }

function renderGrid() {
  const grid = document.getElementById("productGrid");
  const items = getProducts();

  if (!items.length) {
    grid.innerHTML = `<div class="card muted">No products yet. <a href="admin.html">Add some in Admin</a>.</div>`;
    return;
  }

  grid.innerHTML = items.map(p => `
    <article class="card product" aria-label="${p.name}">
      <img src="${p.image}" alt="${p.name}" />
      <div class="meta">
        <strong>${p.name}</strong>
        <span class="price">${money(p.price)}</span>
      </div>
      <p class="muted">${p.description ?? ""}</p>
      <button class="btn btn-primary" onclick="alert('Pretend added to cart: ${p.name}')">Add to Cart</button>
    </article>
  `).join("");
}

(function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  seedIfEmpty();
  renderGrid();
})();
