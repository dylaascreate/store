const LS_KEY = "devnex_products";

function getProducts() {
  const raw = localStorage.getItem(LS_KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveProducts(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function money(n){ return new Intl.NumberFormat('en-MY', {style:'currency', currency:'MYR'}).format(n); }

const els = {
  year: null,
  form: null,
  id: null,
  name: null,
  price: null,
  image: null,
  url: null,            // NEW
  description: null,
  tbody: null,
  resetBtn: null,
  wipeAll: null
};

function fillForm(p){
  els.id.value = p?.id || "";
  els.name.value = p?.name || "";
  els.price.value = p?.price ?? "";
  els.image.value = p?.image || "";
  els.url.value = p?.url || "";            // NEW
  els.description.value = p?.description || "";
  els.name.focus();
}

function clearForm(){
  fillForm(null);
}

function isValidUrl(str){
  try { new URL(str); return true; } catch { return false; }
}

function upsertProduct(e){
  e.preventDefault();
  const id = els.id.value || crypto.randomUUID();
  const product = {
    id,
    name: els.name.value.trim(),
    price: parseFloat(els.price.value || "0"),
    image: els.image.value.trim(),
    url: els.url.value.trim(),             // NEW
    description: els.description.value.trim()
  };

  if (!product.name || !product.image || isNaN(product.price) || !product.url) {
    alert("Please fill in Name, valid Price, Image URL, and Product URL.");
    return;
  }
  if (!isValidUrl(product.image) || !isValidUrl(product.url)) {
    alert("Please enter valid URLs for Image and Product URL.");
    return;
  }

  const list = getProducts();
  const idx = list.findIndex(p => p.id === id);
  if (idx >= 0) list[idx] = product; else list.push(product);
  saveProducts(list);
  clearForm();
  renderTable();
}

function onEdit(id){
  const item = getProducts().find(p => p.id === id);
  if (item) fillForm(item);
}

function onDelete(id){
  if (!confirm("Delete this product?")) return;
  const next = getProducts().filter(p => p.id !== id);
  saveProducts(next);
  renderTable();
}

function renderTable(){
  const items = getProducts();
  els.tbody.innerHTML = items.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${money(p.price)}</td>
      <td><img src="${p.image}" alt="${p.name}"/></td>
      <td class="muted">${p.description ?? ""}</td>
      <td>
        <a
          href="${p.url}"
          class="icon-btn"
          target="_blank"
          rel="noopener"
          title="Open URL"
          aria-label="Open URL"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <!-- simple "open in new" icon -->
            <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.6 5H14V3z"/>
            <path fill="currentColor" d="M5 5h7v2H7v10h10v-5h2v7H5z"/>
          </svg>
        </a>
      </td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" onclick="onEdit('${p.id}')">Edit</button>
          <button class="btn btn-danger" onclick="onDelete('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

(function init(){
  els.year = document.getElementById("year");
  els.form = document.getElementById("productForm");
  els.id = document.getElementById("productId");
  els.name = document.getElementById("name");
  els.price = document.getElementById("price");
  els.image = document.getElementById("image");
  els.url = document.getElementById("url");               // NEW
  els.description = document.getElementById("description");
  els.tbody = document.getElementById("adminTbody");
  els.resetBtn = document.getElementById("resetBtn");
  els.wipeAll = document.getElementById("wipeAll");

  els.year.textContent = new Date().getFullYear();
  els.form.addEventListener("submit", upsertProduct);
  els.resetBtn.addEventListener("click", clearForm);
  els.wipeAll.addEventListener("click", () => {
    if (confirm("Delete ALL products?")) {
      localStorage.removeItem(LS_KEY);
      renderTable();
      clearForm();
    }
  });

  renderTable();
  window.onEdit = onEdit;   // expose for inline onclick
  window.onDelete = onDelete;
})();
