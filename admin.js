const LS_KEY = "tinyshop_products";

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
  els.description.value = p?.description || "";
  els.name.focus();
}

function clearForm(){
  fillForm(null);
}

function upsertProduct(e){
  e.preventDefault();
  const id = els.id.value || crypto.randomUUID();
  const product = {
    id,
    name: els.name.value.trim(),
    price: parseFloat(els.price.value || "0"),
    image: els.image.value.trim(),
    description: els.description.value.trim()
  };

  if (!product.name || !product.image || isNaN(product.price)) {
    alert("Please fill in Name, valid Price, and Image URL.");
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
