// Check if admin is logged in
if (!sessionStorage.getItem('admin_logged_in')) {
    window.location.href = 'admin.html';
}

function logout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'admin-login.html';
}

// Display items in the admin table
async function displayAdminItems() {
    try {
        const items = await db.getAllItems();
        const tbody = document.getElementById('items-table-body');
        
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>
                    <img src="${item.image_url ? `http://localhost:3000${item.image_url}` : 'server/public/uploads/placeholder.jpg'}" 
                         alt="${item.name}" 
                         width="50">
                </td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>$${parseFloat(item.price).toFixed(2)}</td>
                <td>${new Date(item.created_at).toLocaleString()}</td>
                <td>
                    <button onclick="editItem(${item.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error displaying items:', error);
        alert('Error loading items. Please try again.');
    }
}

// Edit item function
async function editItem(id) {
    try {
        const items = await db.getAllItems();
        const item = items.find(item => item.id === id);
        
        if (!item) {
            throw new Error('Item not found');
        }

        // Populate the form with item data
        document.getElementById('name').value = item.name;
        document.getElementById('description').value = item.description;
        document.getElementById('price').value = item.price;
        
        // Show current image preview if exists
        const imagePreview = document.querySelector('.image-preview');
        if (item.image_url) {
            imagePreview.innerHTML = `
                <img src="http://localhost:3000${item.image_url}" 
                     alt="${item.name}" 
                     style="max-width: 200px; margin-top: 10px;">
                <input type="hidden" name="current_image_url" value="${item.image_url}">
            `;
        }

        // Update form for edit mode
        const form = document.getElementById('add-item-form');
        form.dataset.editId = id;
        document.querySelector('.submit-btn').textContent = 'Update Item';
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error editing item:', error);
        alert('Error editing item. Please try again.');
    }
}

// Delete item function
async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await db.deleteItem(id);
            await displayAdminItems();
            alert('Item deleted successfully!');
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item. Please try again.');
        }
    }
}

// Add image preview functionality (add this back)
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.querySelector('.image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" 
                     style="max-width: 200px; margin-top: 10px; border-radius: 4px;">
            `;
        }
        reader.readAsDataURL(file);
    } else {
        // If editing and no new image selected, keep the current image preview
        if (!preview.querySelector('img')) {
            preview.innerHTML = '';
        }
    }
});

// Handle form submission (both add and edit)
document.getElementById('add-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('image');
    
    // Validate form data
    if (!name || !description || !price) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const editId = form.dataset.editId;
        
        if (editId) {
            // Update existing item
            const currentImageUrl = form.querySelector('input[name="current_image_url"]')?.value;
            const updateData = {
                name,
                description,
                price,
                image: imageInput.files[0],
                current_image_url: currentImageUrl
            };
            
            await db.updateItem(editId, updateData);
            form.removeAttribute('data-edit-id');
            document.querySelector('.submit-btn').textContent = 'Add Item';
        } else {
            // Add new item
            const newItem = {
                name,
                description,
                price,
                image: imageInput.files[0]
            };
            
            console.log('Submitting new item:', newItem); // Debug log
            await db.addItem(newItem);
        }

        // Refresh the table and reset the form
        await displayAdminItems();
        form.reset();
        document.querySelector('.image-preview').innerHTML = '';
        
        alert(editId ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Error saving item. Please try again.');
    }
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    displayAdminItems();
}); 