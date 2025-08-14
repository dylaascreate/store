// ---- data access helpers ----
const LS_KEY = "devnex_products";

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
      name: "Netflix Basic Subscription",
      price: 99.0, // set your actual price
      image: "./img/netflix.png",
      url: "https://myrocreative.my.canva.site/netflix-subscription-poster",
      description: "Streaming subscription with movies and TV shows."
    },
    {
      id: crypto.randomUUID(),
      name: "Canva Pro Subscription",
      price: 99.0, // set your actual price
      image: "./img/canva.png",
      url: "https://myrocreative.my.canva.site/canva-subscription-poster",
      description: "Design toolkit with premium templates and magic tools."
    },
    {
      id: crypto.randomUUID(),
      name: "ChatGPT Plus Subscription",
      price: 99.0, // set your actual price
      image: "./img/chatgpt-plus.png",
      url: "https://myrocreative.my.canva.site/chatgpt-subscription-poster",
      description: "Faster AI responses and access to enhanced features."
    },
    // {
    //   id: crypto.randomUUID(),
    //   name: "CapCut Pro Subscription",
    //   price: 0.0, // set your actual price
    //   image: "https://github.com/dylaascreate/store/blob/dev/img/capcut-pro.png",
    //   url: "https://wa.me/0173117853?text=Saya%20berminat%20dengan%20CapCut%20Pro%20Subscription%20Package",
    //   description: "Advanced video editing features and premium assets."
    // },
    // {
    //   id: crypto.randomUUID(),
    //   name: "YouTube Premium Subscription",
    //   price: 9.0, // set your actual price
    //   image: "https://github.com/dylaascreate/store/blob/dev/img/youtube-premium.png",
    //   url: "https://wa.me/0173117853?text=Saya%20berminat%20dengan%20YouTube%20Premium%20Subscription%20Package",
    //   description: "Ad-free videos, background play, and YouTube Music."
    // }
  ];
  saveProducts(seed);
}

// ---- UI render ----
function money(n){ return new Intl.NumberFormat('en-MY', {style:'currency', currency:'MYR'}).format(n); }

function handleBuynow(p){
  const ok = confirm(`View More for "${p.name}"?\n\nURL: ${p.url}`);
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
      <button class="btn btn-primary" style:"margin-top: auto;' onclick='handleBuynow(${JSON.stringify(p)})'>View More</button>
    </article>
  `).join("");
}

(function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  seedIfEmpty();
  window.handleBuynow = handleBuynow; // expose for inline onclick
  renderGrid();
})();
