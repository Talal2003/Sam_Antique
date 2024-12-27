<?php
require_once 'config/database.php';

// Set admin credentials
$admin_username = 'admin'; // Change this to your desired username
$admin_password = 'your_secure_password'; // Change this to your desired password

try {
    // Check if admin already exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE username = ?');
    $stmt->execute([$admin_username]);
    
    if ($stmt->fetch()) {
        echo "Admin user already exists!";
    } else {
        // Create new admin
        $password_hash = password_hash($admin_password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
        $stmt->execute([$admin_username, $password_hash]);
        
        echo "Admin user created successfully!";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?> 