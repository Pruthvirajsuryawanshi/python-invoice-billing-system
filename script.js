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
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    cartContainer.innerHTML = '';

    // Update cart count
    const itemCount = order.getCartItemCount();
    cartCount.textContent = itemCount;

    // Show/hide empty cart message and cart summary
    if (order.isCartEmpty()) {
        emptyMessage.style.display = 'block';
        cartContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        checkoutBtn.disabled = true;
    } else {
        emptyMessage.style.display = 'none';
        cartContainer.style.display = 'block';
        cartSummary.style.display = 'block';
        checkoutBtn.disabled = false;

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

        // Update cart total
        const totals = order.calculateTotals();
        cartTotalAmount.textContent = `₹${totals.finalAmount.toLocaleString()}`;
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

// Delivery speed update function
function updateDeliverySpeed() {
    const selectElement = document.getElementById('delivery-speed-select');
    const newSpeed = selectElement.value;
    order.deliverySpeed = newSpeed;
    
    // Re-render cart and invoice with new delivery charge
    renderCart();
}

// Checkout function
function checkout() {
    if (order.isCartEmpty()) {
        alert('Your cart is empty!');
        return;
    }

    // Show success message
    const successMessage = document.getElementById('checkout-success');
    successMessage.style.display = 'block';

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide other sections
    document.querySelector('.products-section').style.display = 'none';
    document.querySelector('.cart-section').style.display = 'none';
    document.querySelector('.invoice-container').style.display = 'none';
}

// Continue shopping function
function continueShopping() {
    // Hide success message
    const successMessage = document.getElementById('checkout-success');
    successMessage.style.display = 'none';

    // Clear cart
    order.itemsInCart = [];
    
    // Generate new invoice number and date for next order
    order.invoiceNumber = Math.floor(Math.random() * 900000) + 100000;
    order.invoiceDate = new Date();

    // Show all sections again
    document.querySelector('.products-section').style.display = 'block';
    document.querySelector('.cart-section').style.display = 'block';
    document.querySelector('.invoice-container').style.display = 'block';

    // Re-render cart (will be empty)
    renderCart();
}

// Download invoice as PDF
function downloadInvoice() {
    if (order.isCartEmpty()) {
        alert('Cannot download empty invoice!');
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get order details
    const orderDetails = order.displayOrderDetails();
    
    // Generate invoice HTML
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice ${orderDetails.invoiceNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                padding: 40px;
                background: white;
            }
            .invoice-header {
                text-align: center;
                border-bottom: 3px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .invoice-header h1 {
                font-size: 2.5rem;
                color: #333;
                margin-bottom: 10px;
            }
            .invoice-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 5px;
            }
            .invoice-info p {
                margin: 5px 0;
                font-size: 1rem;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th {
                background: #333;
                color: white;
                padding: 12px;
                text-align: left;
            }
            td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
                background: #f9f9f9;
            }
            .summary {
                margin-top: 20px;
                padding: 20px;
                background: #f5f5f5;
                border-radius: 5px;
                border: 2px solid #333;
            }
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px dashed #ccc;
                font-size: 1.1rem;
            }
            .summary-row:last-child {
                border-bottom: none;
            }
            .final-amount {
                font-size: 1.4rem;
                font-weight: bold;
                border-top: 3px double #333;
                padding-top: 15px;
                margin-top: 10px;
            }
            .thank-you {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                background: #333;
                color: white;
                border-radius: 5px;
                font-size: 1.1rem;
            }
            @media print {
                body {
                    padding: 20px;
                }
                @page {
                    margin: 1cm;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-header">
            <h1>INVOICE</h1>
        </div>
        
        <div class="invoice-info">
            <div>
                <p><strong>Invoice No:</strong> ${orderDetails.invoiceNumber}</p>
                <p><strong>Date:</strong> ${orderDetails.invoiceDate}</p>
            </div>
            <div>
                <p><strong>Delivery Speed:</strong> ${orderDetails.deliverySpeed}</p>
                <p><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Deal Price</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails.items.map(({ product, quantity }) => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${quantity}</td>
                        <td>₹${product.price * quantity}</td>
                        <td>₹${product.dealPrice * quantity}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="summary">
            <div class="summary-row">
                <span>Total Price:</span>
                <span>₹${orderDetails.totalPrice} + ₹${orderDetails.deliveryCharge}</span>
            </div>
            <div class="summary-row">
                <span>Discounted Price:</span>
                <span>₹${orderDetails.totalDealPrice}</span>
            </div>
            <div class="summary-row">
                <span>You Saved:</span>
                <span>₹${orderDetails.youSaved}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Charge:</span>
                <span>₹${orderDetails.deliveryCharge}</span>
            </div>
            <div class="summary-row final-amount">
                <span>Final Amount to Pay:</span>
                <span>₹${orderDetails.finalAmount}</span>
            </div>
        </div>

        <div class="thank-you">
            <p>Thank You for shopping! Visit again...</p>
        </div>

        <script>
            window.onload = function() {
                window.print();
            }
        <\/script>
    </body>
    </html>
    `;

    // Write to new window and trigger print
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
}

// Function to populate the invoice UI
function populateInvoice() {
    // Get order details from Order object
    const orderDetails = order.displayOrderDetails();

    // Set invoice details
    document.getElementById('invoice-number').textContent = orderDetails.invoiceNumber;
    document.getElementById('invoice-date').textContent = orderDetails.invoiceDate;
    document.getElementById('delivery-address').textContent = orderDetails.deliveryAddress;

    // Update delivery speed selector to match current order
    document.getElementById('delivery-speed-select').value = order.deliverySpeed;

    // Populate invoice items
    const itemsContainer = document.getElementById('invoice-items');
    itemsContainer.innerHTML = '';

    orderDetails.items.forEach(({ product, quantity }) => {
        const row = document.createElement('tr');
        const itemTotal = product.price * quantity;
        const itemDealTotal = product.dealPrice * quantity;

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${quantity}</td>
            <td>₹${itemTotal}</td>
            <td>₹${itemDealTotal}</td>
        `;
        
        itemsContainer.appendChild(row);
    });

    // Set summary values - matching Python format exactly
    // Python: "Total Price:",total_price,"+",delivery_charge,"\nDiscounted Price: ",total_deal_price,"\nYou Saved: ",total_price- total_deal_price
    document.getElementById('total-price').textContent = `₹${orderDetails.totalPrice} + ₹${orderDetails.deliveryCharge}`;
    document.getElementById('discounted-price').textContent = `₹${orderDetails.totalDealPrice}`;
    document.getElementById('you-saved').textContent = `₹${orderDetails.youSaved}`;
    document.getElementById('delivery-charge').textContent = `₹${orderDetails.deliveryCharge}`;
    document.getElementById('final-amount').textContent = `₹${orderDetails.finalAmount}`;
    
    // Highlight delivery charge based on membership
    const deliveryChargeElement = document.getElementById('delivery-charge');
    if (orderDetails.deliveryCharge === 0) {
        deliveryChargeElement.style.color = '#38a169';
        deliveryChargeElement.style.fontWeight = 'bold';
    } else {
        deliveryChargeElement.style.color = '#2d3748';
        deliveryChargeElement.style.fontWeight = 'normal';
    }
}

// Initialize the invoice when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderProductCards();
    renderCart();
});