'use strict';

const PRODUCT = {
    id: 'wanderer-vessel-tshirt',
    name: 'Wanderer Vessel',
    price: 25.00,
    url: '/Product.html?id=wanderer-vessel-tshirt',
    image: 'Website_Imgs/tshirt.svg',
    description: 'Ilustração original inspirada em viagens marítimas, 100% algodão orgânico',
    categories: ['T-shirt'],
    weight: 200,
};

/* Simulated inventory (client-side only, resets on page reload).
   In production this would come from Snipcart's variant inventory
   management instead of a hardcoded object. */
const STOCK = {
    XS: 5,
    S: 2,
    M: 5,
    L: 10,
    XL: 4,
    XXL: 4,
};

let selectedSize = 'M';
let selectedColor = 'Preto';
let quantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
    initGallery();
    initColorSwatches();
    initSizeSelector();
    initQuantitySelector();
    initSizeGuide();
    initAccordion();
    initViewerCounter();
    initAddToCart();
    renderSizeAvailability();
    renderStockNote();
    renderQuantityControls();
    renderAddToCartButtons();
});

function loadComponent(url, placeholderId) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(url)
        .then(res => res.text())
        .then(html => { el.innerHTML = html; })
        .catch(err => console.error(`Erro ao carregar ${url}:`, err));
}

/* ---------------- Gallery ---------------- */
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const img = thumb.querySelector('img');
            if (mainImage && img) mainImage.src = img.src;
        });
    });
}

/* ---------------- Color swatches ---------------- */
function initColorSwatches() {
    const swatches = document.querySelectorAll('.swatch');
    const valueLabel = document.getElementById('selectedColorLabel');

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            selectedColor = swatch.dataset.color;
            if (valueLabel) valueLabel.textContent = selectedColor;
        });
    });
}

/* ---------------- Size selector ---------------- */
function initSizeSelector() {
    const valueLabel = document.getElementById('selectedSizeLabel');

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('out-of-stock')) return;
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            if (valueLabel) valueLabel.textContent = selectedSize;

            // Selecting a new size can never start above its available stock.
            quantity = Math.min(quantity, STOCK[selectedSize] || 0) || 1;
            renderStockNote();
            renderQuantityControls();
            renderAddToCartButtons();
        });
    });
}

/* ---------------- Quantity selector ---------------- */
function initQuantitySelector() {
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
        quantity = Math.max(1, quantity - 1);
        renderQuantityControls();
    });
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
        const stock = STOCK[selectedSize] || 0;
        quantity = Math.min(stock, quantity + 1);
        renderQuantityControls();
    });
}

function renderQuantityControls() {
    const stock = STOCK[selectedSize] || 0;
    const qtyValue = document.getElementById('qtyValue');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    if (qtyValue) qtyValue.textContent = stock === 0 ? 0 : quantity;
    if (qtyMinus) qtyMinus.disabled = stock === 0 || quantity <= 1;
    if (qtyPlus) qtyPlus.disabled = stock === 0 || quantity >= stock;
}

/* ---------------- Stock note + size availability ---------------- */
function renderStockNote() {
    const note = document.getElementById('stockNote');
    if (!note) return;

    const stock = STOCK[selectedSize] || 0;
    if (stock === 0) {
        note.textContent = `Esgotado neste tamanho (${selectedSize})`;
        note.classList.add('out');
    } else {
        note.textContent = `Restam apenas ${stock} unidade${stock === 1 ? '' : 's'} neste tamanho`;
        note.classList.remove('out');
    }
}

function renderSizeAvailability() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        const size = btn.dataset.size;
        const outOfStock = (STOCK[size] || 0) === 0;
        btn.classList.toggle('out-of-stock', outOfStock);
        btn.disabled = outOfStock;
    });
}

function renderAddToCartButtons() {
    const stock = STOCK[selectedSize] || 0;
    document.querySelectorAll('.js-add-to-cart').forEach(btn => {
        if (!btn.dataset.label) btn.dataset.label = btn.textContent.trim();
        btn.disabled = stock === 0;
        btn.textContent = stock === 0 ? 'Esgotado neste tamanho' : btn.dataset.label;
    });
}

/* ---------------- Size guide modal ---------------- */
function initSizeGuide() {
    const openBtn = document.querySelector('.size-guide-link');
    const overlay = document.getElementById('sizeGuideOverlay');
    const closeBtn = document.querySelector('.size-guide-close');

    if (!openBtn || !overlay) return;

    openBtn.addEventListener('click', () => overlay.classList.add('open'));
    closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
}

/* ---------------- Accordion ---------------- */
function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            item.classList.toggle('open');
        });
    });
}

/* ---------------- Fake live viewer counter (social proof) ---------------- */
function initViewerCounter() {
    const el = document.getElementById('viewerCount');
    if (!el) return;
    let count = parseInt(el.textContent, 10) || 8;
    setInterval(() => {
        count += Math.random() > 0.5 ? 1 : -1;
        count = Math.max(4, Math.min(19, count));
        el.textContent = count;
    }, 4000);
}

/* ---------------- Add to cart (Snipcart JS SDK) ----------------
   data-item-custom*-value attributes are unreliable once Snipcart has
   already parsed the button: building the ProductDefinition at click
   time via Snipcart.api.cart.items.add() always reflects the live
   selection. See https://docs.snipcart.com/v3/sdk/basics */
function initAddToCart() {
    document.querySelectorAll('.js-add-to-cart').forEach(btn => {
        btn.addEventListener('click', addCurrentSelectionToCart);
    });
}

function addCurrentSelectionToCart() {
    const stock = STOCK[selectedSize] || 0;
    if (stock === 0 || quantity < 1) return;

    const productDefinition = {
        ...PRODUCT,
        quantity,
        customFields: [
            { name: 'Tamanho', value: selectedSize },
            { name: 'Cor', value: selectedColor },
        ],
    };

    const onAdded = () => {
        // Simulated local inventory deduction; a real store would rely on
        // Snipcart's own variant inventory management synced server-side.
        STOCK[selectedSize] = Math.max(0, STOCK[selectedSize] - quantity);
        quantity = Math.min(quantity, STOCK[selectedSize]) || 1;
        renderSizeAvailability();
        renderStockNote();
        renderQuantityControls();
        renderAddToCartButtons();
    };

    if (window.Snipcart) {
        window.Snipcart.api.cart.items.add(productDefinition).then(onAdded);
        return;
    }

    window.LoadSnipcart && window.LoadSnipcart();
    document.addEventListener('snipcart.ready', () => {
        window.Snipcart.api.cart.items.add(productDefinition).then(onAdded);
    }, { once: true });
}
