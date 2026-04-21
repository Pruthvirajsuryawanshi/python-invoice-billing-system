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
    }

    addItem(product, quantity) {
        this.itemsInCart.push({ product, quantity });
    }

    displayOrderDetails() {
        let totalPrice = 0;
        let totalDealPrice = 0;
        const deliveryCharge = Order.deliveryCharges[this.deliverySpeed];

        this.itemsInCart.forEach(({ product, quantity }) => {
            totalPrice += product.price * quantity;
            totalDealPrice += product.dealPrice * quantity;
        });

        return {
            items: this.itemsInCart,
            totalPrice,
            totalDealPrice,
            deliveryCharge,
            youSaved: totalPrice - totalDealPrice,
            finalAmount: totalDealPrice + deliveryCharge,
            deliverySpeed: this.deliverySpeed,
            deliveryAddress: this.deliveryAddress
        };
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
        `;

        card.innerHTML = cardHTML;
        cardsContainer.appendChild(card);
    });
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
    populateInvoice();
});