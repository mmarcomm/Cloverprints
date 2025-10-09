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
        });

    // Load form
    fetch("form.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("form-placeholder").innerHTML = data;
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
    // Load Form
    fetch("Form.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("Form-placeholder").innerHTML = data;
        });
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

function initHamburger() {
  const checkbox = document.getElementById('menu-toggle-checkbox');
  const button   = document.getElementById('menu-button');
  const panel    = document.getElementById('menu-panel');

  if (!checkbox || !button || !panel) return;

  const reflect = () => {
    const expanded = checkbox.checked;
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', expanded);
  };

  reflect();
  checkbox.addEventListener('change', reflect);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkbox.checked) {
      checkbox.checked = false;
      reflect();
      button.focus();
    }
  });

  // Close when a menu link is clicked
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    checkbox.checked = false;
    reflect();
  });
}