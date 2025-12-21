// Filename: Javascript.js
// Author: Marco
// Description: JavaScript file for custom functionality
// Created on: 

// Strict mode for better error handling
'use strict';

// Your code starts here


//
document.addEventListener("DOMContentLoaded", function () {
    // Get the product name from the URL
    const params = new URLSearchParams(window.location.search);
    // Support both `?nome=...` and legacy `?id=...` query params (prefer `nome`).
    const productName = params.get("nome") || params.get("id");  // Example: "Sem_titulo_3"
    // Fetch product data from JSON
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            // Helper: resolve a product key by param (either matches a key or the object's id field)
            const resolveProductKey = (param) => {
                if (!param) return null;
                if (data[param]) return param; // direct key match
                for (const k in data) {
                    if (data[k] && data[k].id === param) return k; // match id field
                }
                return null;
            };

            const productKey = resolveProductKey(productName);
            if (productKey) {
                updateProduct(data, productKey);  // Load the correct product
            } else {
                console.error("Produto não encontrado! (searched for: ", productName, ")");
            }
        })
        .catch(error => console.error("Erro ao carregar os produtos:", error));
});







// load the JSON
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    // Accept either `nome` or `id` so links using either format work.
    const productName = params.get("nome") || params.get("id"); // Extract the product key (may be a key or an id)

    fetch("products.json")
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            // resolve key by direct match or by id field
            const resolveProductKey = (param) => {
                if (!param) return null;
                if (data[param]) return param;
                for (const k in data) if (data[k] && data[k].id === param) return k;
                return null;
            };

            const productKey = resolveProductKey(productName);
            if (productKey) {
                displayProduct(data, productKey);
            } else {
                console.warn("Produto não encontrado. Carregando padrão.");
                displayProduct(data, "Sem_titulo_0"); // Fallback only if no product is found
            }
        })
        .catch(error => console.error("Error loading JSON:", error));
});

function displayProduct(data, productKey) {
    var product = data[productKey];

    // Update text content
    document.getElementById("name").textContent = product["name"];
    document.getElementById("product-Materials").textContent = product["product-Materials"];
    document.getElementById("product-Text").innerHTML = product["product-Text"];
    document.getElementById("product-Year").textContent = product["year"];

    // Set main image (with fallback)
    var mainImage = document.getElementById("mainImage");
    if (product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
    } else {
        mainImage.src = "placeholder.jpg"; // Fallback image if none exist
    }

    // Generate thumbnails
    var thumbnailsContainer = document.querySelector(".thumbnail-container");
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = ""; // Clear previous thumbnails
    
        product.images.forEach(imageSrc => {
            let img = document.createElement("img");
            img.src = imageSrc;
            img.classList.add("thumbnail");
            img.onclick = function () { changeImage(img); };
            thumbnailsContainer.appendChild(img);
        });
    } else {
        console.error("Error: .thumbnail-container is missing in the DOM.");
    }
}



// placeholderes
document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
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

// Function to change the main image when a thumbnail is clicked
function changeImage(imgElement) {
    document.getElementById("mainImage").src = imgElement.src;
}

  
//left and right with everything else
//left and right with everything else
let productKeys = [];
let currentIndex = 0;

// Fetch the product data from JSON
document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {

            productKeys = Object.keys(data);
            const params = new URLSearchParams(window.location.search);
            const productName = params.get("nome") || params.get("id");

            // resolve param to actual product key (either direct key or matching id field)
            const resolveProductKey = (param) => {
                if (!param) return null;
                if (data[param]) return param;
                for (const k in data) if (data[k] && data[k].id === param) return k;
                return null;
            };

            const resolvedKey = resolveProductKey(productName);

            // Find index of the resolved product key in productKeys, or default to the first one
            currentIndex = resolvedKey && productKeys.indexOf(resolvedKey) !== -1 ? productKeys.indexOf(resolvedKey) : 0;

            if (productKeys.length > 0) {
                updateProduct(data, productKeys[currentIndex]); // Load correct product
            }
        })
        .catch(error => console.error("Error loading JSON:", error));
});

function navigateProducts(direction, data) {
    // Update current index in a circular way
    currentIndex = (currentIndex + direction + productKeys.length) % productKeys.length;
    updateProduct(data, productKeys[currentIndex]);
}

function updateProduct(data, productKey) {
    let product = data[productKey];

    // Update text content
    document.getElementById("name").textContent = product["name"];
    document.getElementById("product-Materials").textContent = product["product-Materials"];
    document.getElementById("product-Text").innerHTML = product["product-Text"];
    document.getElementById("product-Year").textContent = product["year"];
    document.querySelector(".black").textContent = product["status"];

    // Update images
    document.getElementById("mainImage").src = product.images["mainImage"];
    document.getElementById("mainImage2").src = product.images["mainImage2"];
    document.getElementById("image2").src = product.images["image2"];
    document.getElementById("image3").src = product.images["image3"];

    // Update "Interessado" button
    let buyButton = document.getElementById("buyButton");
    if (buyButton) {
        if (product["buyLink"] && product["buyLink"].trim() !== "") { 
            buyButton.href = product["buyLink"];  // Update link
            buyButton.style.display = "block";  // Show button
        } else {
            buyButton.style.display = "none";  // Hide button if no link
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let mainImage = document.getElementById("mainImage");
    let mainImage2 = document.getElementById("mainImage2");
    let image2 = document.getElementById("image2");
    let image3 = document.getElementById("image3");

    if (mainImage) mainImage.src = "Website Imgs/default-image.png";  // Set a default image
    if (mainImage2) mainImage2.src = "Website Imgs/Sem_Titulo_0.png";
    if (image2) image2.src = "Website Imgs/IMG_5839_2.png";
    if (image3) image3.src = "Website Imgs/IMG_58392.png";

    document.querySelectorAll(".ImagemainProduct, .Image2Product, .Image3Product").forEach(img => {
        img.addEventListener("click", function () {
            changeImage(this);
        });
    });
});
// Function to change the main image when clicking a thumbnail
function changeImage(imgElement) {
    let mainImage = document.getElementById("mainImage");
    if (mainImage && imgElement.src) {
        mainImage.src = imgElement.src;
    } else {
        console.error("Error: Image source is missing.");
    }
}

function updateProduct(data, productKey) {
let product = data[productKey];

// Check elements before updating
let titleElem = document.getElementById("name");
if (titleElem) titleElem.textContent = product["name"];

let materialsElem = document.getElementById("product-Materials");
if (materialsElem) materialsElem.textContent = product["product-Materials"];

let textElem = document.getElementById("product-Text");
if (textElem) textElem.innerHTML = product["product-Text"];

let yearElem = document.getElementById("product-Year");
if (yearElem) yearElem.textContent = product["year"];

let statusElem = document.querySelector(".black");
if (statusElem) statusElem.textContent = product["status"];

let mainImgElem = document.getElementById("mainImage");
if (mainImgElem) mainImgElem.src = product.images["mainImage"];

// Debugging check for mainImage2
let mainImage2Elem = document.getElementById("mainImage2");
if (mainImage2Elem) {
    console.log("Updating mainImage2:", product.images["mainImage2"]);
    mainImage2Elem.src = product.images["mainImage2"];
} else {
    console.error("mainImage2 not found in the DOM");
}

let img2Elem = document.getElementById("image2");
if (img2Elem) img2Elem.src = product.images["image2"];

let img3Elem = document.getElementById("image3");
if (img3Elem) img3Elem.src = product.images["image3"];

let buyButton = document.querySelector(".hero-btn");
if (buyButton) {
  if (product["buyLink"]) {
      buyButton.href = product["buyLink"];
      buyButton.style.display = "block";
  } else {
      buyButton.style.display = "none";
  }
}
}
//left and right with everything else
//left and right with everything else

function navigateProducts(direction, data) {
    // Update current index in a circular way
    currentIndex = (currentIndex + direction + productKeys.length) % productKeys.length;
    let newProductKey = productKeys[currentIndex];

    // Update the displayed product
    updateProduct(data, newProductKey);

    // Update the URL without reloading the page
    const newUrl = `Product.html?nome=${newProductKey}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        fetch("products.json")
            .then(response => response.json())
            .then(data => {
                productKeys = Object.keys(data);
                const params = new URLSearchParams(window.location.search);
                const productName = params.get("nome") || params.get("id");

                // Find index of the product in the URL, or default to the first one
                currentIndex = productKeys.indexOf(productName) !== -1 ? productKeys.indexOf(productName) : 0;

                if (productKeys.length > 0) {
                    updateProduct(data, productKeys[currentIndex]); // Load correct product
                }

                document.querySelector(".sidebutton-left")?.addEventListener("click", function () {
                    navigateProducts(-1, data);
                });

                document.querySelector(".sidebutton-right")?.addEventListener("click", function () {
                    navigateProducts(1, data);
                });
            })
            .catch(error => console.error("Error loading JSON:", error));
    }, 100); // 100ms delay before executing code
});

