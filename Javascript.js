// Filename: Javascript.js
// Author: Marco
// Description: JavaScript file for custom functionality
// Created on: [Insert Date]

// Strict mode for better error handling
'use strict';

// Your code starts here

// placeholderes
document.addEventListener("DOMContentLoaded", function() {
    injectBannerDecoration();
    // Load header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            initHamburger();
            setActiveNav();
        });

    // Load form
    fetch("form.html")
        .then(response => response.text())
        .then(data => {
            if (document.getElementById("form-placeholder"))
                document.getElementById("form-placeholder").innerHTML = data;
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            if (document.getElementById("footer-placeholder"))
                document.getElementById("footer-placeholder").innerHTML = data;
        });

    // Render product grid from JSON if on index page
    const grid = document.getElementById("product-grid");
    if (grid) {
        fetch("products.json")
            .then(r => r.json())
            .then(products => renderProductGrid(products, grid))
            .catch(err => console.error("Erro ao carregar produtos:", err));
    }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.itemId;
      if (id) window.location.href = `Product.html?id=${encodeURIComponent(id)}`;
    });
  });
});


// Scroll to top button
function scrollToButton() {
    var targetButton = document.getElementById('obrasButton');
    if (targetButton) {
        // Calculate the Y offset of the target button from the top of the page
        var targetPosition = targetButton.getBoundingClientRect().top + window.pageYOffset;
        
        // Scroll to the calculated position smoothly
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Sidebar 
document.addEventListener("DOMContentLoaded", function () {
    const sidebars = document.querySelectorAll(".sidebar, .sidebar-selected");

    sidebars.forEach(sidebar => {
        sidebar.addEventListener("click", function (event) {
            event.preventDefault(); // Evita a navegação padrão

            // Encontra o item atualmente selecionado
            const currentSelected = document.querySelector(".sidebar-selected");
            
            if (currentSelected) {
                // Remove a classe "sidebar-selected" e adiciona "sidebar"
                currentSelected.classList.remove("sidebar-selected");
                currentSelected.classList.add("sidebar");

                // Muda o ícone de volta para "SGVs/arrow.svg"
                const currentIcon = currentSelected.querySelector(".smaller-icon");
                if (currentIcon) {
                    currentIcon.src = "SGVs/arrow.svg";
                }
            }

            // Se o item clicado já era o selecionado, apenas o desativa
            if (this !== currentSelected) {
                this.classList.remove("sidebar");
                this.classList.add("sidebar-selected");

                // Muda o ícone para "SGVs/arrowblack.svg"
                const newIcon = this.querySelector(".smaller-icon");
                if (newIcon) {
                    newIcon.src = "SGVs/arrowblack.svg";
                }
            }
        });
    });
});

// 100ms delay
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        fetch("products.json")
            .then(response => response.json())
            .then(data => {
                productData = data; // Store globally
                productKeys = Object.keys(data);

                const params = new URLSearchParams(window.location.search);
                const productName = params.get("nome");

                // Load product from URL or default to the first one
                currentIndex = productKeys.indexOf(productName) !== -1 ? productKeys.indexOf(productName) : 0;
                if (productKeys.length > 0) {
                    updateProduct(data, productKeys[currentIndex]);
                }

                document.querySelector(".sidebutton-left")?.addEventListener("click", function () {
                    navigateProducts(-1);
                });

                document.querySelector(".sidebutton-right")?.addEventListener("click", function () {
                    navigateProducts(1);
                });
            })
            .catch(error => console.error("Error loading JSON:", error));
    }, 100); // 100ms delay
});

/* ---- Product grid renderer (index.html) ---- */
function renderProductGrid(products, grid) {
    grid.innerHTML = '';
    Object.values(products).forEach(p => {
        const price = Number(p.price).toLocaleString('pt-PT', {
            style: 'currency', currency: 'EUR', minimumFractionDigits: 0
        });
        const badge = p.badge
            ? `<span class="product-badge">${p.badge}</span>`
            : '';
        const card = document.createElement('a');
        card.href = p.url;
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                ${badge}
                <img src="${p.cardImage}" alt="${p.name}" class="product-image">
            </div>
            <div class="product-info">
                <h2 class="product-name">${p.name}</h2>
                <span class="product-category">${p.category}</span>
                <span class="product-price">${price}</span>
            </div>`;
        grid.appendChild(card);
    });
}

function initHamburger() {
  const checkbox = document.getElementById('menu-toggle-checkbox');
  const panel    = document.getElementById('menu-panel');

  if (!checkbox || !panel) return;

  const reflect = () => {
    document.body.classList.toggle('no-scroll', checkbox.checked);
  };

  reflect();
  checkbox.addEventListener('change', reflect);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkbox.checked) {
      checkbox.checked = false;
      reflect();
    }
  });

  // Close when a menu link is clicked (covers same-page anchors like #conectar)
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    checkbox.checked = false;
    reflect();
  });
}

function setActiveNav() {
    const current = decodeURIComponent(window.location.pathname.split('/').pop()) || 'index.html';
    const productPages = [
        'Product-mockup.html',
        'Product-urban-explorer.html',
        'Product-minimal-essence.html',
    ];

    document.querySelectorAll('#navgatorList a').forEach(a => a.classList.remove('activemenu'));

    document.querySelectorAll('#navgatorList a').forEach(a => {
        const href = a.getAttribute('href') || '';
        // Skip anchor-only links (e.g. Sobre.html#conectar) — they are section links, not pages
        if (href.includes('#')) return;

        if (href === current || (productPages.includes(current) && href === 'index.html')) {
            a.classList.add('activemenu');
        }
    });
}

function injectBannerDecoration() {
    const svg = `<svg class="banner-deco" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <!-- Editorial baseline grid -->
  <g stroke="#00BFFF" stroke-width="0.5" opacity="0.065">
    <line x1="0" y1="50"  x2="1440" y2="50"/>
    <line x1="0" y1="100" x2="1440" y2="100"/>
    <line x1="0" y1="150" x2="1440" y2="150"/>
    <line x1="0" y1="200" x2="1440" y2="200"/>
    <line x1="0" y1="250" x2="1440" y2="250"/>
    <line x1="0" y1="300" x2="1440" y2="300"/>
    <line x1="0" y1="350" x2="1440" y2="350"/>
  </g>
  <!-- Concentric arcs radiating from top-right corner -->
  <g stroke="#00BFFF" fill="none">
    <path d="M 1040,0 A 400,400 0 0 0 1440,400"   stroke-width="1.4" opacity="0.30"/>
    <path d="M  840,0 A 600,600 0 0 0 1440,600"   stroke-width="1.1" opacity="0.22"/>
    <path d="M  640,0 A 800,800 0 0 0 1440,800"   stroke-width="0.9" opacity="0.15"/>
    <path d="M  440,0 A 1000,1000 0 0 0 1440,1000" stroke-width="0.7" opacity="0.10"/>
    <path d="M  240,0 A 1200,1200 0 0 0 1440,1200" stroke-width="0.6" opacity="0.06"/>
  </g>
  <!-- Large circles off bottom-left — organic contrast -->
  <circle cx="-50" cy="450" r="250" stroke="#00BFFF" stroke-width="1.4" fill="none" opacity="0.14"/>
  <circle cx="-50" cy="450" r="170" stroke="#00BFFF" stroke-width="0.7" fill="none" opacity="0.08"/>
  <!-- Registration mark — top-left -->
  <g stroke="#00BFFF" stroke-width="0.9" fill="none" opacity="0.45">
    <circle cx="52" cy="52" r="15"/>
    <line x1="52" y1="29" x2="52" y2="75"/>
    <line x1="29" y1="52" x2="75" y2="52"/>
  </g>
  <!-- Registration mark — bottom-right -->
  <g stroke="#00BFFF" stroke-width="0.75" fill="none" opacity="0.32">
    <circle cx="1388" cy="348" r="12"/>
    <line x1="1388" y1="328" x2="1388" y2="368"/>
    <line x1="1368" y1="348" x2="1408" y2="348"/>
  </g>
  <!-- Crop marks — top-right -->
  <g stroke="#00BFFF" stroke-width="0.6" opacity="0.28">
    <line x1="1416" y1="0"  x2="1416" y2="22"/>
    <line x1="1418" y1="22" x2="1440" y2="22"/>
  </g>
  <!-- Crop marks — bottom-left -->
  <g stroke="#00BFFF" stroke-width="0.6" opacity="0.28">
    <line x1="0"  y1="378" x2="22"  y2="378"/>
    <line x1="22" y1="378" x2="22"  y2="400"/>
  </g>
</svg>`;

    document.querySelectorAll('.banner').forEach(banner => {
        if (banner.querySelector('.banner-deco')) return;
        banner.insertAdjacentHTML('afterbegin', svg);
    });
}