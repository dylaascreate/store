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
      url: "https://example.com/products/minimal-mug",            // NEW
      description: "Stoneware mug with a matte finish."
    },
    {
      id: crypto.randomUUID(),
      name: "Canvas Tote",
      price: 59.0,
      image: "https://picsum.photos/seed/tote/600/400",
      url: "https://example.com/products/canvas-tote",            // NEW
      description: "Reusable everyday tote with reinforced handles."
    },
    {
      id: crypto.randomUUID(),
      name: "Desk Lamp",
      price: 129.0,
      image: "https://picsum.photos/seed/lamp/600/400",
      url: "https://example.com/products/desk-lamp",              // NEW
      description: "Adjustable lamp for cozy workspace lighting."
    }
  ];
  saveProducts(seed);
}

// ---- UI render ----
function money(n){ return new Intl.NumberFormat('en-MY', {style:'currency', currency:'MYR'}).format(n); }

function handleBuynow(p){
  const ok = confirm(`Whatsapp admin for "${p.name}"?\n\nURL: ${p.url}`);
  if (ok) {
    window.location.href = p.url;
  }
}

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
        <strong>${p.name}</strong><br>
        <span class="price">${money(p.price)}</span>
      </div>
      <p class="muted">${p.description ?? ""}</p>
      <!-- UPDATED: confirm + redirect to specific product URL -->
      <button class="btn btn-primary" onclick='handleBuynow(${JSON.stringify(p)})'>Buy Now</button>
    </article>
  `).join("");
}

(function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  seedIfEmpty();
  window.handleBuynow = handleBuynow; // expose for inline onclick
  renderGrid();
})();
