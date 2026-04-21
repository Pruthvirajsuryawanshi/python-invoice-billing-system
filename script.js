// JavaScript classes matching Python backend structure

class Product {
    constructor(name, price, dealPrice, rating) {
        this.name = name;
        this.price = price;
        this.dealPrice = dealPrice;
        this.youSave = price - dealPrice;
        this.rating = rating;
    }

    displayProductDetails() {
        return {
            name: this.name,
            price: this.price,
            dealPrice: this.dealPrice,
            youSave: this.youSave,
            rating: this.rating
        };
    }
}

class ElectronicItem extends Product {
    constructor(name, price, dealPrice, rating, extraFeatures, warrantyInMonths) {
        super(name, price, dealPrice, rating);
        this.extraFeatures = extraFeatures;
        this.warrantyInMonths = warrantyInMonths;
    }

    displayProductDetails() {
        const details = super.displayProductDetails();
        details.extraFeatures = this.extraFeatures;
        details.warrantyInMonths = this.warrantyInMonths;
        return details;
    }
}

class GroceryItems extends Product {
    constructor(name, price, dealPrice, rating, expiryDate) {
        super(name, price, dealPrice, rating);
        this.expiryDate = expiryDate;
    }

    displayProductDetails() {
        const details = super.displayProductDetails();
        details.expiryDate = this.expiryDate;
        return details;
    }
}

class Order {
    static deliveryCharges = {
        "prime member": 0,
        "non prime member": 50
    };

    constructor(deliverySpeed, deliveryAddress) {
        this.itemsInCart = [];
        this.deliverySpeed = deliverySpeed;
        this.deliveryAddress = deliveryAddress;
        this.invoiceNumber = Math.floor(Math.random() * 900000) + 100000;
        this.invoiceDate = new Date();
    }

    addItem(product, quantity) {
        // Check if product already exists in cart
        const existingItem = this.itemsInCart.find(item => item.product.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.itemsInCart.push({ product, quantity });
        }
    }

    removeItem(productName) {
        this.itemsInCart = this.itemsInCart.filter(item => item.product.name !== productName);
    }

    updateQuantity(productName, newQuantity) {
        const item = this.itemsInCart.find(item => item.product.name === productName);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productName);
            } else {
                item.quantity = newQuantity;
            }
        }
    }

    calculateTotals() {
        let totalPrice = 0;
        let totalDealPrice = 0;

        this.itemsInCart.forEach(({ product, quantity }) => {
            totalPrice += product.price * quantity;
            totalDealPrice += product.dealPrice * quantity;
        });

        const deliveryCharge = Order.deliveryCharges[this.deliverySpeed];
        const youSaved = totalPrice - totalDealPrice;
        const finalAmount = totalDealPrice + deliveryCharge;

        return {
            totalPrice,
            totalDealPrice,
            deliveryCharge,
            youSaved,
            finalAmount
        };
    }

    displayOrderDetails() {
        const totals = this.calculateTotals();
        
        return {
            items: this.itemsInCart,
            ...totals,
            deliverySpeed: this.deliverySpeed,
            deliveryAddress: this.deliveryAddress,
            invoiceNumber: this.invoiceNumber,
            invoiceDate: this.invoiceDate.getDate().toString().padStart(2, '0') + '-' + 
                        (this.invoiceDate.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                        this.invoiceDate.getFullYear()
        };
    }

    getCartItemCount() {
        return this.itemsInCart.reduce((total, item) => total + item.quantity, 0);
    }

    isCartEmpty() {
        return this.itemsInCart.length === 0;
    }
}

// Sample data matching Python backend exactly
const mobile = new ElectronicItem("Samsung A15 5G", 19999, 10500, 4.9, "Fingerprint Unlock", 12);
const TV = new ElectronicItem("Samsung TV", 40000, 38000, 4.5, "Google Assistance", 14);
const mouse = new ElectronicItem("Ideapad Mouse", 2000, 1600, 3.9, "RGB", 6);
const flour = new GroceryItems("1 KG TATA Wheat", 400, 350, 4.2, "01/02/2026");

// Product data array
const products = [mobile, TV, mouse, flour];

const order = new Order("non prime member", "Jintur");
// Pre-add items to cart (matching Python backend)
order.addItem(TV, 2);
order.addItem(mobile, 2);
order.addItem(mouse, 1);
order.addItem(flour, 1);

// Generate random invoice number and current date (matching Python)
const invoiceNumber = Math.floor(Math.random() * 900000) + 100000;
const today = new Date();
const invoiceDate = today.getDate().toString().padStart(2, '0') + '-' + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                    today.getFullYear();

// Function to render product cards
function renderProductCards() {
    const cardsContainer = document.getElementById('product-cards');
    cardsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Determine product type
        const isElectronic = product instanceof ElectronicItem;
        const isGrocery = product instanceof GroceryItems;
        const badgeClass = isElectronic ? 'badge-electronic' : 'badge-grocery';
        const badgeText = isElectronic ? '🔌 Electronic' : '🛒 Grocery';

        // Build card HTML
        let cardHTML = `
            <div class="product-card-header">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-rating">⭐ ${product.rating}</span>
            </div>
            <div class="product-details">
                <div class="product-detail-row">
                    <span class="detail-label">Original Price:</span>
                    <span class="detail-value price">₹${product.price.toLocaleString()}</span>
                </div>
                <div class="product-detail-row">
                    <span class="detail-label">Deal Price:</span>
                    <span class="detail-value deal-price">₹${product.dealPrice.toLocaleString()}</span>
                </div>
                <div class="product-detail-row">
                    <span class="detail-label">You Save:</span>
                    <span class="detail-value savings">₹${product.youSave.toLocaleString()}</span>
                </div>
        `;

        // Add type-specific details
        if (isElectronic) {
            cardHTML += `
                <div class="product-detail-row">
                    <span class="detail-label">Features:</span>
                    <span class="detail-value">${product.extraFeatures}</span>
                </div>
                <div class="product-detail-row">
                    <span class="detail-label">Warranty:</span>
                    <span class="detail-value">${product.warrantyInMonths} Months</span>
                </div>
            `;
        }

        if (isGrocery) {
            cardHTML += `
                <div class="product-detail-row">
                    <span class="detail-label">Expiry Date:</span>
                    <span class="detail-value">${product.expiryDate}</span>
                </div>
            `;
        }

        cardHTML += `
            </div>
            <span class="product-badge ${badgeClass}">${badgeText}</span>
            <button class="add-to-cart-btn" onclick="addToCart('${product.name}')">
                🛒 Add to Cart
            </button>
        `;

        card.innerHTML = cardHTML;
        cardsContainer.appendChild(card);
    });
}

// Function to render cart items
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');

    cartContainer.innerHTML = '';

    // Update cart count
    const itemCount = order.getCartItemCount();
    cartCount.textContent = itemCount;

    // Show/hide empty cart message
    if (order.isCartEmpty()) {
        emptyMessage.style.display = 'block';
        cartContainer.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        cartContainer.style.display = 'block';

        // Render each cart item
        order.itemsInCart.forEach(({ product, quantity }) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemTotal = product.dealPrice * quantity;

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">₹${product.dealPrice.toLocaleString()} × ${quantity} = ₹${itemTotal.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${product.name}', ${quantity - 1})">−</button>
                    <span class="quantity-display">${quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${product.name}', ${quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${product.name}')">Remove</button>
                </div>
            `;

            cartContainer.appendChild(cartItem);
        });
    }

    // Update invoice if cart is not empty
    if (!order.isCartEmpty()) {
        populateInvoice();
    }
}

// Cart management functions
function addToCart(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        order.addItem(product, 1);
        renderCart();
    }
}

function removeFromCart(productName) {
    order.removeItem(productName);
    renderCart();
}

function updateQuantity(productName, newQuantity) {
    order.updateQuantity(productName, newQuantity);
    renderCart();
}

// Function to populate the invoice UI
function populateInvoice() {
    // Get order details from Order object
    const orderDetails = order.displayOrderDetails();

    // Set invoice details
    document.getElementById('invoice-number').textContent = invoiceNumber;
    document.getElementById('invoice-date').textContent = invoiceDate;
    document.getElementById('delivery-speed').textContent = orderDetails.deliverySpeed;
    document.getElementById('delivery-address').textContent = orderDetails.deliveryAddress;

    // Populate invoice items
    const itemsContainer = document.getElementById('invoice-items');

    orderDetails.items.forEach(({ product, quantity }) => {
        const row = document.createElement('tr');
        const itemTotal = product.price * quantity;
        const itemDealTotal = product.dealPrice * quantity;

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${quantity}</td>
            <td>₹${itemTotal.toLocaleString()}</td>
            <td>₹${itemDealTotal.toLocaleString()}</td>
        `;
        
        itemsContainer.appendChild(row);
    });

    // Set summary values
    document.getElementById('total-price').textContent = `₹${orderDetails.totalPrice.toLocaleString()}`;
    document.getElementById('delivery-charge').textContent = `₹${orderDetails.deliveryCharge}`;
    document.getElementById('discounted-price').textContent = `₹${orderDetails.totalDealPrice.toLocaleString()}`;
    document.getElementById('you-saved').textContent = `₹${orderDetails.youSaved.toLocaleString()}`;
    document.getElementById('final-amount').textContent = `₹${orderDetails.finalAmount.toLocaleString()}`;
}

// Initialize the invoice when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderProductCards();
    renderCart();
});