<?php
require_once 'middleware/admin-auth.php';
require_once 'config/database.php';

// Fetch item details if ID is provided
if (isset($_GET['id'])) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM items WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$item) {
            header("Location: admin-dashboard.php");
            exit;
        }
    } catch (PDOException $e) {
        $error_message = "Error fetching item: " . $e->getMessage();
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_item'])) {
    try {
        $image_url = $_POST['existing_image'];

        // Handle new image upload if provided
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $upload_dir = 'uploads/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $image_name = time() . '_' . $_FILES['image']['name'];
            move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $image_name);
            $image_url = $upload_dir . $image_name;
        }

        $stmt = $pdo->prepare('UPDATE items SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?');
        $stmt->execute([
            $_POST['name'],
            $_POST['description'],
            $_POST['price'],
            $image_url,
            $_POST['id']
        ]);

        header("Location: admin-dashboard.php");
        exit;
    } catch (PDOException $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Item</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="admin-container">
        <h1>Edit Item</h1>
        <a href="admin-dashboard.php" class="back-btn">Back to Dashboard</a>

        <?php if (isset($error_message)): ?>
            <div class="error-message"><?php echo $error_message; ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data" class="edit-item-form">
            <input type="hidden" name="id" value="<?php echo htmlspecialchars($item['id']); ?>">
            <input type="hidden" name="existing_image" value="<?php echo htmlspecialchars($item['image_url']); ?>">
            
            <div class="form-group">
                <label for="name">Item Name:</label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($item['name']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description" required><?php echo htmlspecialchars($item['description']); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" step="0.01" value="<?php echo htmlspecialchars($item['price']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="image">New Image (optional):</label>
                <input type="file" id="image" name="image" accept="image/*">
                <?php if ($item['image_url']): ?>
                    <div class="current-image">
                        <p>Current Image:</p>
                        <img src="<?php echo htmlspecialchars($item['image_url']); ?>" alt="Current item image" width="100">
                    </div>
                <?php endif; ?>
            </div>
            
            <button type="submit" name="update_item" class="submit-btn">Update Item</button>
        </form>
    </div>
</body>
</html> 