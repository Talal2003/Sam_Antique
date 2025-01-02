// Display items on the main page
async function displayItems() {
    try {
        const items = await db.getAllItems();
        const container = document.getElementById('items-container');
        
        // Group items by type
        const itemsByType = items.reduce((acc, item) => {
            const typeName = item.type_name || 'Uncategorized';
            if (!acc[typeName]) {
                acc[typeName] = [];
            }
            acc[typeName].push(item);
            return acc;
        }, {});

        // Generate HTML for sections
        container.innerHTML = `
            <div class="timeline-sections">
                ${Object.entries(itemsByType).map(([typeName, typeItems]) => `
                    <div class="timeline-section" id="timeline-${typeName.toLowerCase().replace(/\s+/g, '-')}">
                        <h2 class="timeline-heading">${typeName}</h2>
                        <div class="timeline-items">
                            ${typeItems.map(item => `
                                <div class="timeline-item">
                                    <div class="item-image">
                                        <img src="${item.image_url ? `https://325718fs-3000.use.devtunnels.ms${item.image_url}` : 'server/public/uploads/placeholder.jpg'}" 
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
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Error displaying items:', error);
        document.getElementById('items-container').innerHTML = '<p>Error loading items. Please try again later.</p>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await displayItems();
}); 