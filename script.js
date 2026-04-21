// Sample data matching the Python backend
const sampleData = {
    invoiceNumber: 123456,
    invoiceDate: "21-04-2026",
    deliverySpeed: "non prime member",
    deliveryAddress: "Jintur",
    items: [
        {
            name: "Samsung TV",
            quantity: 2,
            price: 40000,
            dealPrice: 38000
        },
        {
            name: "Samsung A15 5G",
            quantity: 2,
            price: 19999,
            dealPrice: 10500
        },
        {
            name: "Ideapad Mouse",
            quantity: 1,
            price: 2000,
            dealPrice: 1600
        },
        {
            name: "1 KG TATA Wheat",
            quantity: 1,
            price: 400,
            dealPrice: 350
        }
    ],
    deliveryCharges: {
        "prime member": 0,
        "non prime member": 50
    }
};

// Function to populate the invoice UI
function populateInvoice() {
    // Set invoice details
    document.getElementById('invoice-number').textContent = sampleData.invoiceNumber;
    document.getElementById('invoice-date').textContent = sampleData.invoiceDate;
    document.getElementById('delivery-speed').textContent = sampleData.deliverySpeed;
    document.getElementById('delivery-address').textContent = sampleData.deliveryAddress;

    // Populate invoice items
    const itemsContainer = document.getElementById('invoice-items');
    let totalPrice = 0;
    let totalDealPrice = 0;

    sampleData.items.forEach(item => {
        const row = document.createElement('tr');
        const itemTotal = item.price * item.quantity;
        const itemDealTotal = item.dealPrice * item.quantity;
        
        totalPrice += itemTotal;
        totalDealPrice += itemDealTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${itemTotal.toLocaleString()}</td>
            <td>₹${itemDealTotal.toLocaleString()}</td>
        `;
        
        itemsContainer.appendChild(row);
    });

    // Calculate summary values
    const deliveryCharge = sampleData.deliveryCharges[sampleData.deliverySpeed];
    const youSaved = totalPrice - totalDealPrice;
    const finalAmount = totalDealPrice + deliveryCharge;

    // Set summary values
    document.getElementById('total-price').textContent = `₹${totalPrice.toLocaleString()}`;
    document.getElementById('delivery-charge').textContent = `₹${deliveryCharge}`;
    document.getElementById('discounted-price').textContent = `₹${totalDealPrice.toLocaleString()}`;
    document.getElementById('you-saved').textContent = `₹${youSaved.toLocaleString()}`;
    document.getElementById('final-amount').textContent = `₹${finalAmount.toLocaleString()}`;
}

// Initialize the invoice when page loads
document.addEventListener('DOMContentLoaded', populateInvoice);