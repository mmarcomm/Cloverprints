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
    const cubeSvg = `<svg class="banner-deco banner-deco--cube" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <g stroke="#00BFFF" stroke-width="1.4" fill="none" stroke-linejoin="round">
    <path d="M 100,8 L 182,54 L 100,100 L 18,54 Z"/>
    <line x1="182" y1="54" x2="182" y2="146"/>
    <line x1="182" y1="146" x2="100" y2="192"/>
    <line x1="18"  y1="54" x2="18"  y2="146"/>
    <line x1="18"  y1="146" x2="100" y2="192"/>
    <line x1="100" y1="100" x2="100" y2="192"/>
  </g>
</svg>`;

    const accentsSvg = `<svg class="banner-deco banner-deco--accents" viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <path d="M 44,28 L 66,40 L 44,52 L 22,40 Z" stroke="#00BFFF" stroke-width="0.9" fill="none"/>
  <g stroke="#00BFFF" stroke-width="0.65">
    <line x1="0"  y1="98"  x2="88" y2="48"/>
    <line x1="0"  y1="122" x2="66" y2="84"/>
    <line x1="12" y1="155" x2="72" y2="121"/>
  </g>
  <g fill="#00BFFF">
    <circle cx="124" cy="18"  r="2.2"/>
    <circle cx="158" cy="46"  r="1.5"/>
    <circle cx="8"   cy="68"  r="1.6"/>
    <circle cx="142" cy="128" r="2"/>
    <circle cx="28"  cy="148" r="1.5"/>
    <circle cx="92"  cy="8"   r="1.2"/>
    <circle cx="168" cy="100" r="1.2"/>
  </g>
</svg>`;

    document.querySelectorAll('.banner').forEach(banner => {
        if (banner.querySelector('.banner-deco')) return;
        banner.insertAdjacentHTML('afterbegin', cubeSvg + accentsSvg);
    });
}