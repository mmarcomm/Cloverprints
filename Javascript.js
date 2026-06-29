// Filename: Javascript.js
// Author: Marco
// Description: JavaScript file for custom functionality
// Created on: [Insert Date]

// Strict mode for better error handling
'use strict';

// Your code starts here

// placeholderes
document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            initHamburger();
            setActiveNav();
            initCart();
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

/* ---- Cart badge: hide count when the cart is empty ---- */
function initCart() {
    const count = document.querySelector('.cart-count');
    if (!count) return;
    const sync = () => {
        const n = parseInt((count.textContent || '').trim(), 10) || 0;
        count.classList.toggle('cart-count--empty', n === 0);
    };
    sync();
    new MutationObserver(sync).observe(count, {
        childList: true, characterData: true, subtree: true
    });
}

function setActiveNav() {
    const current = decodeURIComponent(window.location.pathname.split('/').pop()) || 'index.html';
    const productPages = [
        'Product-mockup.html',
        'Product-urban-explorer.html',
        'Product-minimal-essence.html',
    ];

    document.querySelectorAll('#navgatorList a, .mobile-nav-list a').forEach(a => a.classList.remove('activemenu'));

    document.querySelectorAll('#navgatorList a, .mobile-nav-list a').forEach(a => {
        const href = a.getAttribute('href') || '';
        // Skip anchor-only links (e.g. Sobre.html#conectar) — they are section links, not pages
        if (href.includes('#')) return;

        if (href === current || (productPages.includes(current) && href === 'index.html')) {
            a.classList.add('activemenu');
        }
    });
}

/* ---- Snipcart global loader — makes the header cart work site-wide ---- */
window.SnipcartSettings = {
    publicApiKey: 'OTgyZTdlMzItNzNhZC00YjM1LTkxMzItZWY0ZmYzODU5NTQ5NjM4OTQ4NjU1ODg4NTQxNzg3',
    loadStrategy: 'on-user-interaction',
};

(()=>{var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var f=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,m=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(m.forEach(t=>document.addEventListener(t,o)),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],e=document.querySelector("#snipcart"),i=document.querySelector(`src[src^="${window.SnipcartSettings.protocol}://${window.SnipcartSettings.domain}"][src$="snipcart.js"]`),n=document.querySelector(`link[href^="${window.SnipcartSettings.protocol}://${window.SnipcartSettings.domain}"][href$="snipcart.css"]`);e||(e=document.createElement("div"),e.id="snipcart",e.setAttribute("hidden","true"),document.body.appendChild(e)),v(e),i||(i=document.createElement("script"),i.src=`${window.SnipcartSettings.protocol}://${window.SnipcartSettings.domain}/themes/v${window.SnipcartSettings.version}/default/snipcart.js`,i.async=!0,t.appendChild(i)),n||(n=document.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=`${window.SnipcartSettings.protocol}://${window.SnipcartSettings.domain}/themes/v${window.SnipcartSettings.version}/default/snipcart.css`,t.prepend(n)),m.forEach(g=>document.removeEventListener(g,o))}function v(t){!f||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
