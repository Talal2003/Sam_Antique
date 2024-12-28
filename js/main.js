// Display items on the main page
async function displayItems() {
    const items = await db.getAllItems();
    const container = document.getElementById('items-container');
    
    // Helper function to get correct image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'server/public/uploads/placeholder.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocalhost 
            ? 'http://localhost:3000'
            : 'https://7c30-2600-1702-3160-7fa0-55e2-7afe-af71-6559.ngrok-free.app';
            
        return `${baseUrl}${imageUrl}`;
    };
    
    container.innerHTML = items.map(item => `
        <div class="item fade-in">
            <div class="item-image">
                <img src="${getImageUrl(item.image_url)}" 
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