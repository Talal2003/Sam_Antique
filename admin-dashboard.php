<?php
require_once 'middleware/admin-auth.php';
require_once 'config/database.php';

// Handle item creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_item'])) {
    try {
        // Use PDO prepared statements for security
        $stmt = $pdo->prepare('INSERT INTO items (name, description, price, image_url) VALUES (?, ?, ?, ?)');
        
        // Handle image upload
        $image_url = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $upload_dir = 'uploads/';
            // Create uploads directory if it doesn't exist
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $image_name = time() . '_' . $_FILES['image']['name'];
            move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $image_name);
            $image_url = $upload_dir . $image_name;
        }

        $stmt->execute([
            $_POST['name'],
            $_POST['description'],
            $_POST['price'],
            $image_url
        ]);

        // Add success message
        $success_message = "Item added successfully!";
    } catch (PDOException $e) {
        // Add error message
        $error_message = "Error: " . $e->getMessage();
    }
}

// Fetch all items using PDO
try {
    $stmt = $pdo->query("SELECT * FROM items ORDER BY created_at DESC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error_message = "Error fetching items: " . $e->getMessage();
    $items = [];
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Item Management</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="admin-container">
        <h1>Admin Dashboard</h1>
        <a href="logout.php" class="logout-btn">Logout</a>

        <!-- Add Item Form -->
        <div class="add-item-form">
            <h2>Add New Item</h2>
            <form method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="name">Item Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="image">Image:</label>
                    <input type="file" id="image" name="image" accept="image/*">
                </div>
                
                <button type="submit" name="add_item" class="submit-btn">Add Item</button>
            </form>
        </div>

        <!-- Items Table -->
        <div class="items-table">
            <h2>Current Items</h2>
            <?php if (isset($success_message)): ?>
                <div class="success-message"><?php echo $success_message; ?></div>
            <?php endif; ?>
            <?php if (isset($error_message)): ?>
                <div class="error-message"><?php echo $error_message; ?></div>
            <?php endif; ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $item): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($item['id']); ?></td>
                        <td>
                            <?php if ($item['image_url']): ?>
                                <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                                     alt="<?php echo htmlspecialchars($item['name']); ?>" 
                                     width="50">
                            <?php else: ?>
                                No Image
                            <?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($item['name']); ?></td>
                        <td><?php echo htmlspecialchars($item['description']); ?></td>
                        <td>$<?php echo number_format($item['price'], 2); ?></td>
                        <td><?php echo $item['created_at']; ?></td>
                        <td>
                            <a href="edit-item.php?id=<?php echo $item['id']; ?>" class="edit-btn">Edit</a>
                            <a href="delete-item.php?id=<?php echo $item['id']; ?>" 
                               class="delete-btn" 
                               onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html> 