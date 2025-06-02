(function() {
  // Product data with image URLs, 10 products total
  const products = [
    {
      id: 1,
      name: "Chai Masala",
      description: "A classic mix of aromatic spices to brew your perfect masala chai.",
      price: 250,
      category: "Tea",
      image: "chaimasala2.png"
    },
    {
      id: 2,
      name: "Coffee Beans",
      description: "Premium Arabica roasted coffee beans for rich and bold flavor.",
      price: 850,
      category: "Coffee",
      image: "coffeep.jpg"
    },
    {
      id: 3,
      name: "Dark Chocolate",
      description: "Velvety dark chocolate with hints of espresso, perfect for dessert lovers.",
      price: 400,
      category: "Coffee",
      image: "choclatep.png"
    },
    {
      id: 4,
      name: "Mocha Cream",
      description: "Creamy mocha flavored milkshake topped with whipped cream and chocolate syrup.",
      price: 320,
      category: "Milkshake",
      image: "Café Mocha Glacé (Iced Mocha Latte).jpeg"
    },
    {
      id: 5,
      name: "Green Tea Leaves",
      description: "Fresh green tea leaves harvested from organic gardens.",
      price: 475,
      category: "Tea",
      image: "instant matcha green tea with leaf and dry isolated on white background.jpeg"
    },
    {
      id: 6,
      name: "Hazelnut Latte",
      description: "Smooth coffee latte infused with rich hazelnut syrup.",
      price: 280,
      category: "Coffee",
      image: "Nutella Latte_ A Chocolate Hazelnut Coffee Indulgence - The Crafted Drink.jpeg"
    },
    {
      id: 7,
      name: "Strawberry Milkshake",
      description: "Sweet strawberry milkshake with real fruit puree and creamy texture.",
      price: 300,
      category: "Milkshake",
      image: "POWDER FRUIT EXTRACTS_ INVIGORATE, STRENGTHEN & BALANCE.jpeg"
    },
    {
      id: 8,
      name: "Earl Grey",
      description: "Traditional Earl Grey tea with a hint of bergamot essence.",
      price: 275,
      category: "Tea",
      image: "Mahamosa Earl Grey Pu-erh White Tea 8 oz (with pu-erh, bai mu dan white peony, bergamot) - Loose Leaf (Looseleaf) Earl Grey Black and White Tea Blend.jpeg"
    },
    {
      id: 9,
      name: "Vanilla Shake",
      description: "Classic vanilla milkshake topped with creamy whipped topping.",
      price: 315,
      category: "Milkshake",
      image: "download (2).jpeg"
    },
    {
      id: 10,
      name: "Caramel Macchiato",
      description: "Rich espresso layered with steamed milk and caramel syrup.",
      price: 350,
      category: "Coffee",
      image: "Caramel Macchiato.jpeg"
    }
  ];

  const productsContainer = document.getElementById("products-container");
  const cartBtn = document.getElementById("toggle-cart-btn");
  const cartElem = document.getElementById("cart");
  const cartList = document.getElementById("cart-list");
  const cartTotalElem = document.getElementById("cart-total");
  const cartEmptyElem = document.getElementById("cart-empty");
  const cartCountElem = document.getElementById("cart-count");

  // Cart object: productId -> quantity
  let cart = {};

  // Load cart from localStorage if available
  if (localStorage.getItem("shopCart")) {
    try {
      cart = JSON.parse(localStorage.getItem("shopCart"));
    } catch(e) {
      cart = {};
    }
  }

  // Render all products
  function renderProducts() {
    productsContainer.innerHTML = "";
    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.setAttribute("tabindex", "0"); // focusable for accessibility
      
      productCard.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">₹${product.price.toFixed(0)}</div>
        <button class="add-to-cart" aria-label="Add ${product.name} to cart" data-id="${product.id}">Add to Cart</button>
      `;

      productsContainer.appendChild(productCard);
    });
  }

  // Update cart visible count
  function updateCartCount() {
    const totalQty = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartCountElem.textContent = totalQty > 0 ? totalQty : "";
  }

  // Render the cart details
  function renderCart() {
    cartList.innerHTML = "";

    const productIds = Object.keys(cart);
    if (productIds.length === 0) {
      cartEmptyElem.style.display = "block";
      cartTotalElem.textContent = "";
      return;
    }
    cartEmptyElem.style.display = "none";

    let totalPrice = 0;
    productIds.forEach(pid => {
      const qty = cart[pid];
      const product = products.find(p => p.id === parseInt(pid));
      if (!product) return;

      const itemTotal = product.price * qty;
      totalPrice += itemTotal;

      const itemElem = document.createElement("div");
      itemElem.className = "cart-item";

      itemElem.innerHTML = `
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-qty" aria-label="Quantity">${qty}</div>
        <div class="cart-item-price">₹${itemTotal.toFixed(0)}</div>
        <button class="cart-item-remove" aria-label="Remove one ${product.name} from cart">&times;</button>
      `;

      // Remove button event
      const removeBtn = itemElem.querySelector(".cart-item-remove");
      removeBtn.onclick = () => {
        removeFromCart(product.id);
      };

      cartList.appendChild(itemElem);
    });
    cartTotalElem.textContent = "Total: ₹" + totalPrice.toFixed(0);
  }

  // Add product to cart
  function addToCart(productId) {
    if (cart[productId]) {
      cart[productId]++;
    } else {
      cart[productId] = 1;
    }
    saveCart();
    updateCartCount();
    renderCart();
  }

  // Remove one quantity of product from cart
  function removeFromCart(productId) {
    if (!cart[productId]) return;
    cart[productId]--;
    if (cart[productId] <= 0) {
      delete cart[productId];
    }
    saveCart();
    updateCartCount();
    renderCart();
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(cart));
  }

  // Toggle cart visibility
  function toggleCart() {
    const isOpen = cartElem.classList.contains("open");
    if (isOpen) {
      cartElem.classList.remove("open");
      cartElem.setAttribute("aria-hidden", "true");
    } else {
      cartElem.classList.add("open");
      cartElem.setAttribute("aria-hidden", "false");
    }
  }

  // Event delegation for add to cart buttons
  productsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = e.target.getAttribute("data-id");
      if (id) {
        addToCart(parseInt(id));
      }
    }
  });

  // Cart toggle button click
  cartBtn.addEventListener("click", () => {
    toggleCart();
  });

  // Accessibility: close cart on Escape key press
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartElem.classList.contains("open")) {
      toggleCart();
      cartBtn.focus();
    }
  });

  // Initialize render
  renderProducts();
  updateCartCount();
  renderCart();
})();

/*(function () {
  const products = [
    {
      id: 1,
      name: "Espresso",
      description: "Ergonomic and lightweight",
      price: 799,
      image: "coffee4.jpg"
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "RGB backlit gaming keyboard",
      price: 2499,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "USB-C Hub",
      description: "Multiport adapter with HDMI",
      price: 1299,
      image: "https://via.placeholder.com/150"
    }
  ];

  const productsContainer = document.getElementById("products-container");
  const cartBtn = document.getElementById("toggle-cart-btn");
  const cartElem = document.getElementById("cart");
  const cartList = document.getElementById("cart-list");
  const cartTotalElem = document.getElementById("cart-total");
  const cartEmptyElem = document.getElementById("cart-empty");
  const cartCountElem = document.getElementById("cart-count");

  let cart = {};

  if (localStorage.getItem("shopCart")) {
    try {
      cart = JSON.parse(localStorage.getItem("shopCart"));
    } catch (e) {
      cart = {};
    }
  }

  function renderProducts() {
    productsContainer.innerHTML = "";
    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.setAttribute("tabindex", "0");

      productCard.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">₹${product.price.toFixed(0)}</div>
        <button class="add-to-cart" aria-label="Add ${product.name} to cart" data-id="${product.id}">Add to Cart</button>
      `;

      productsContainer.appendChild(productCard);
    });
  }

  function updateCartCount() {
    const totalQty = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartCountElem.textContent = totalQty > 0 ? totalQty : "";
  }

  function renderCart() {
    cartList.innerHTML = "";
    const productIds = Object.keys(cart);
    if (productIds.length === 0) {
      cartEmptyElem.style.display = "block";
      cartTotalElem.textContent = "";
      return;
    }
    cartEmptyElem.style.display = "none";

    let totalPrice = 0;
    productIds.forEach(pid => {
      const qty = cart[pid];
      const product = products.find(p => p.id === parseInt(pid));
      if (!product) return;

      const itemTotal = product.price * qty;
      totalPrice += itemTotal;

      const itemElem = document.createElement("div");
      itemElem.className = "cart-item";

      itemElem.innerHTML = `
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-qty" aria-label="Quantity">${qty}</div>
        <div class="cart-item-price">₹${itemTotal.toFixed(0)}</div>
        <button class="cart-item-remove" aria-label="Remove one ${product.name} from cart">&times;</button>
      `;

      const removeBtn = itemElem.querySelector(".cart-item-remove");
      removeBtn.onclick = () => {
        removeFromCart(product.id);
      };

      cartList.appendChild(itemElem);
    });
    cartTotalElem.textContent = "Total: ₹" + totalPrice.toFixed(0);
  }

  function addToCart(productId) {
    if (cart[productId]) {
      cart[productId]++;
    } else {
      cart[productId] = 1;
    }
    saveCart();
    updateCartCount();
    renderCart();
  }

  function removeFromCart(productId) {
    if (!cart[productId]) return;
    cart[productId]--;
    if (cart[productId] <= 0) {
      delete cart[productId];
    }
    saveCart();
    updateCartCount();
    renderCart();
  }

  function saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(cart));
  }

  function toggleCart() {
    const isOpen = cartElem.classList.contains("open");
    if (isOpen) {
      cartElem.classList.remove("open");
      cartElem.setAttribute("aria-hidden", "true");
    } else {
      cartElem.classList.add("open");
      cartElem.setAttribute("aria-hidden", "false");
    }
  }

  productsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = e.target.getAttribute("data-id");
      if (id) {
        addToCart(parseInt(id));
      }
    }
  });

  cartBtn.addEventListener("click", () => {
    toggleCart();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartElem.classList.contains("open")) {
      toggleCart();
      cartBtn.focus();
    }
  });

  renderProducts();
  updateCartCount();
  renderCart();
})();*/
const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        const productName = card.querySelector(".product-name").textContent.toLowerCase();
        const productDescription = card.querySelector(".product-description").textContent.toLowerCase();

        // Check if the product name or description includes the search query
        if (productName.includes(query) || productDescription.includes(query)) {
            card.style.display = "";
            card.style.display ="" // Show card
        } else {
            card.style.display = "none"; // Hide card
        }
    });
});
