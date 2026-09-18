const PRODUCTS = [
  { id: "p1", name: "Ceramic Mug", desc: "แก้วเซรามิกทรงเรียบ เคลือบด้าน", price: 290, emoji: "☕" },
  { id: "p2", name: "Linen Tote Bag", desc: "กระเป๋าผ้าลินิน ทนทาน ใส่ของจุใจ", price: 450, emoji: "👜" },
  { id: "p3", name: "Desk Lamp", desc: "โคมไฟตั้งโต๊ะ ปรับความสว่างได้", price: 890, emoji: "💡" },
  { id: "p4", name: "Notebook Set", desc: "สมุดโน้ตปกอ่อน 3 เล่ม กระดาษเกรดพรีเมียม", price: 320, emoji: "📓" },
  { id: "p5", name: "Wool Scarf", desc: "ผ้าพันคอขนแกะ นุ่ม อบอุ่น", price: 690, emoji: "🧤" },
  { id: "p6", name: "Wooden Tray", desc: "ถาดไม้เนื้อแข็ง เข้ามุมทุกพื้นที่", price: 550, emoji: "📦" },
];

const THB = (n) => "฿" + n.toLocaleString("th-TH");

const grid = document.getElementById("productGrid");
const overlay = document.getElementById("overlay");
const modalThumb = document.getElementById("modalThumb");
const modalName = document.getElementById("modalName");
const modalUnitPrice = document.getElementById("modalUnitPrice");
const modalTotal = document.getElementById("modalTotal");
const qtyValue = document.getElementById("qtyValue");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

let currentProduct = null;
let currentQty = 1;
let cartItemCount = 0;
let toastTimer = null;

function renderProducts() {
  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="product-card">
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">${THB(p.price)}</div>
        <button class="btn-buy" type="button" data-id="${p.id}">กดซื้อ</button>
      </div>
    </article>
  `).join("");
}

function updateModalTotal() {
  qtyValue.textContent = currentQty;
  modalTotal.textContent = THB(currentProduct.price * currentQty);
}

function openModal(productId) {
  currentProduct = PRODUCTS.find((p) => p.id === productId);
  if (!currentProduct) return;
  currentQty = 1;

  modalThumb.textContent = currentProduct.emoji;
  modalName.textContent = currentProduct.name;
  modalUnitPrice.textContent = THB(currentProduct.price) + " / ชิ้น";
  updateModalTotal();

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  currentProduct = null;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-buy");
  if (!btn) return;
  openModal(btn.dataset.id);
});

document.getElementById("qtyMinus").addEventListener("click", () => {
  if (currentQty > 1) {
    currentQty -= 1;
    updateModalTotal();
  }
});

document.getElementById("qtyPlus").addEventListener("click", () => {
  currentQty += 1;
  updateModalTotal();
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  if (!currentProduct) return;
  cartItemCount += currentQty;
  cartCount.textContent = cartItemCount;
  showToast(`สั่งซื้อ "${currentProduct.name}" x${currentQty} สำเร็จ 🎉`);
  closeModal();
});

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});

renderProducts();
