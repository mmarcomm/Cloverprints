'use strict';

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header.html', 'header-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
    initGallery();
    initColorSwatches();
    initSizeSelector();
    initSizeGuide();
    initAccordion();
    initViewerCounter();
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
    const addToCartBtn = document.querySelector('.snipcart-add-item');

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const color = swatch.dataset.color;
            if (valueLabel) valueLabel.textContent = color;
            if (addToCartBtn) addToCartBtn.setAttribute('data-item-custom2-value', color);
        });
    });
}

/* ---------------- Size selector ---------------- */
function initSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-btn:not(.out-of-stock)');
    const valueLabel = document.getElementById('selectedSizeLabel');
    const addToCartBtn = document.querySelector('.snipcart-add-item');

    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const size = btn.dataset.size;
            if (valueLabel) valueLabel.textContent = size;
            if (addToCartBtn) addToCartBtn.setAttribute('data-item-custom1-value', size);
        });
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
