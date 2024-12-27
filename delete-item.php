<?php
require_once 'middleware/admin-auth.php';
require_once 'config/database.php';

if (isset($_GET['id'])) {
    try {
        // First, get the image URL to delete the file if it exists
        $stmt = $pdo->prepare("SELECT image_url FROM items WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        // Delete the image file if it exists
        if ($item && $item['image_url'] && file_exists($item['image_url'])) {
            unlink($item['image_url']);
        }

        // Delete the item from the database
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = ?");
        $stmt->execute([$_GET['id']]);

        header("Location: admin-dashboard.php");
        exit;
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    header("Location: admin-dashboard.php");
    exit;
} 