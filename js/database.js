class Database {
    constructor() {
        this.API_URL = 'https://325718fs-3000.use.devtunnels.ms/api';
    }

    async getAllItems() {
        try {
            const response = await fetch(`${this.API_URL}/items`);
            const items = await response.json();
            return items.map(item => ({
                ...item,
                type_name: item.type_name || 'Uncategorized'
            }));
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    }

    async addItem(item) {
        try {
            const formData = new FormData();
            
            // Append all item data to FormData
            formData.append('name', item.name);
            formData.append('description', item.description);
            formData.append('price', item.price);
            formData.append('type_id', item.type_id);
            
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
            console.log('Add item response:', result);
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

    async getItemTypes() {
        const response = await fetch(`${this.API_URL}/item-types`);
        return await response.json();
    }
}

const db = new Database(); 