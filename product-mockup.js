'use strict';

/* Per-page config — set window.__PRODUCT / window.__STOCK before this script.
   Falls back to Wanderer Vessel defaults so Product-mockup.html needs no change. */
const PRODUCT = window.__PRODUCT || {
    id: 'wanderer-vessel-tshirt',
    name: 'Wanderer Vessel',
    price: 45.00,
    url: 'Product-mockup.html',
    image: 'Website_Imgs/tshirt.svg',
    description: 'Ilustração original inspirada em viagens marítimas, 100% algodão orgânico',
    categories: ['T-shirt'],
    weight: 200,
};

const STOCK = window.__STOCK || {
    XS: 5,
    S: 2,
    M: 5,
    L: 10,
    XL: 4,
    XXL: 4,
};

let selectedSize = 'M';
let selectedColor = 'Branco';
let currentGalleryIndex = 0;
let _pswpLightbox = null;

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
    initGallery();
    initGalleryZoom();
    initColorSwatches();
    initSizeSelector();
    initSizeGuide();
    initAccordion();
    initAddToCart();
    renderSizeAvailability();
    renderStockNote();
    renderAddToCartButtons();
    initProductNav();
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

    document.querySelectorAll('.gallery-thumb:not(.gallery-thumb--skeleton)').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const img = thumb.querySelector('img');
            if (mainImage && img) mainImage.src = img.src;
            currentGalleryIndex = parseInt(thumb.dataset.index, 10) || 0;
        });
    });

    // Fade out "Ampliar" hint after 2.5 s
    const hint = document.getElementById('galleryZoomHint');
    if (hint) setTimeout(() => hint.classList.add('fade-out'), 2500);
}

/* ---------------- Gallery zoom (PhotoSwipe lightbox) ---------------- */
function initGalleryZoom() {
    const galleryMain = document.getElementById('galleryMain');
    if (!galleryMain) return;

    const openAtCurrent = () => openLightbox(currentGalleryIndex);
    galleryMain.addEventListener('click', openAtCurrent);
    galleryMain.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAtCurrent(); }
    });
}

async function openLightbox(index) {
    if (!_pswpLightbox) {
        const { default: PhotoSwipeLightbox } = await import(
            'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.js'
        );
        _pswpLightbox = new PhotoSwipeLightbox({
            gallery: '#pswp-gallery',
            children: 'a',
            pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.js'),
        });
        _pswpLightbox.init();
    }
    _pswpLightbox.loadAndOpen(index);
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
    const stickyChip = document.getElementById('stickySizeChip');

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('out-of-stock')) return;
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            if (valueLabel) valueLabel.textContent = selectedSize;
            if (stickyChip) stickyChip.textContent = selectedSize;

            renderStockNote();
            renderAddToCartButtons();
        });
    });
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
    if (stock === 0) return;

    const productDefinition = {
        ...PRODUCT,
        quantity: 1,
        customFields: [
            // `options` must match the crawlable definition so Snipcart
            // renders these as dropdowns and accepts the selected `value`.
            { name: 'Tamanho', options: 'XS|S|M|L|XL|XXL', value: selectedSize },
            { name: 'Cor', options: 'Branco', value: selectedColor },
        ],
    };

    const onAdded = () => {
        // Simulated local inventory deduction; a real store would rely on
        // Snipcart's own variant inventory management synced server-side.
        STOCK[selectedSize] = Math.max(0, STOCK[selectedSize] - 1);
        renderSizeAvailability();
        renderStockNote();
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

/* ---------------- Explorar Coleção (prev / next as product cards) ---------------- */
function initProductNav() {
    fetch('products.json')
        .then(r => r.json())
        .then(data => {
            const keys = Object.keys(data);
            const idx  = keys.indexOf(PRODUCT.id);
            if (idx === -1 || keys.length < 2) return;

            const prevKey = keys[(idx - 1 + keys.length) % keys.length];
            const nextKey = keys[(idx + 1) % keys.length];
            const prev = data[prevKey];
            const next = data[nextKey];

            const fmt = p => Number(p).toLocaleString('pt-PT', {
                style: 'currency', currency: 'EUR', minimumFractionDigits: 0
            });

            const section = document.createElement('section');
            section.className = 'explore-section';
            section.innerHTML = `
                <div class="explore-container">
                    <div class="section-header">
                        <h2 class="section-title">Explorar Coleção</h2>
                    </div>
                    <div class="explore-grid">
                        <a class="explore-card" href="${prev.url}">
                            <div class="explore-card__direction">← Anterior</div>
                            <div class="explore-card__image-wrap">
                                <img src="${prev.cardImage || ''}" alt="${prev.name}">
                            </div>
                            <div class="explore-card__info">
                                <span class="explore-card__name">${prev.name}</span>
                                <span class="explore-card__price">${fmt(prev.price)}</span>
                            </div>
                        </a>
                        <a class="explore-card" href="${next.url}">
                            <div class="explore-card__direction">Próximo →</div>
                            <div class="explore-card__image-wrap">
                                <img src="${next.cardImage || ''}" alt="${next.name}">
                            </div>
                            <div class="explore-card__info">
                                <span class="explore-card__name">${next.name}</span>
                                <span class="explore-card__price">${fmt(next.price)}</span>
                            </div>
                        </a>
                    </div>
                </div>`;

            const reviews = document.querySelector('.reviews-section');
            if (reviews) reviews.insertAdjacentElement('beforebegin', section);
        })
        .catch(() => {});
}

