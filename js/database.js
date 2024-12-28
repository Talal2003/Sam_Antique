class Database {
    constructor() {
        // Check if we're in production (GitHub Pages)
        const isProduction = window.location.hostname !== 'localhost';
        
        // Use local URL for development, your computer's IP/domain for production
        this.API_URL = isProduction 
            ? 'http://192.168.1.68:3000/api'  // Replace with your computer's IP
            : 'http://localhost:3000/api';
    }

    async getAllItems() {
        const response = await fetch(`${this.API_URL}/items`);
        return await response.json();
    }

    async addItem(item) {
        try {
            const formData = new FormData();
            
            // Append all item data to FormData
            formData.append('name', item.name);
            formData.append('description', item.description);
            formData.append('price', item.price);
            
            // If there's an image file, append it
            if (item.image instanceof File) {
                formData.append('image', item.image);
            }

            const response = await fetch(`${this.API_URL}/items`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const result = await response.json();
            console.log('Add item response:', result); // Debug log
            return result;
        } catch (error) {
            console.error('Error in addItem:', error);
            throw error;
        }
    }

    async deleteItem(id) {
        await fetch(`${this.API_URL}/items/${id}`, {
            method: 'DELETE'
        });
    }

    async validateAdmin(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async updateItem(id, item) {
        const formData = new FormData();
        
        // Append all item data to FormData
        formData.append('name', item.name);
        formData.append('description', item.description);
        formData.append('price', item.price);
        
        // If there's an image file, append it
        if (item.image && item.image.size > 0) {
            formData.append('image', item.image);
        }
        
        // Append current image URL if exists
        if (item.current_image_url) {
            formData.append('current_image_url', item.current_image_url);
        }

        const response = await fetch(`${this.API_URL}/items/${id}`, {
            method: 'PUT',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to update item');
        }
        
        return await response.json();
    }
}

const db = new Database(); 