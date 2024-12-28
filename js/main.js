// Display items on the main page
async function displayItems() {
    const items = await db.getAllItems();
    const container = document.getElementById('items-container');
    
    container.innerHTML = items.map(item => `
        <div class="item fade-in">
            <div class="item-image">
                <img src="${item.image_url ? `${db.API_URL.replace('/api', '')}${item.image_url}` : 'server/public/uploads/placeholder.jpg'}" 
                     alt="${item.name}">
                <div class="item-overlay">
                    <button class="view-details">View Details</button>
                </div>
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="price">$${parseFloat(item.price).toFixed(2)}</span>
                    <span class="availability">In Stock</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await displayItems();
}); 