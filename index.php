<?php
require_once 'config/database.php';

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
    <title>Hussam Treasures | Antique Store</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <nav>
        <div class="logo">
            <i class="fas fa-gem"></i>
            Hussam Treasures
        </div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#collection">Collection</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Discover Timeless Beauty</h1>
            <p>Explore our curated collection of unique antiques and Hussam treasures</p>
            <a href="#collection" class="cta-button">View Collection</a>
        </div>
    </section>

    <div class="section-divider"></div>

    <section id="collection" class="collection">
        <h2>Featured Collection</h2>
        <div class="items-grid">
            <?php foreach ($items as $item): ?>
            <div class="item fade-in">
                <div class="item-image">
                    <?php if ($item['image_url']): ?>
                        <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                             alt="<?php echo htmlspecialchars($item['name']); ?>">
                    <?php else: ?>
                        <img src="items/placeholder.jpg" alt="No image available">
                    <?php endif; ?>
                    <div class="item-overlay">
                        <button class="view-details">View Details</button>
                    </div>
                </div>
                <div class="item-info">
                    <h3><?php echo htmlspecialchars($item['name']); ?></h3>
                    <p class="item-description"><?php echo htmlspecialchars($item['description']); ?></p>
                    <div class="item-footer">
                        <span class="price">$<?php echo number_format($item['price'], 2); ?></span>
                        <span class="availability">In Stock</span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <div class="section-divider"></div>

    <section id="about" class="about">
        <div class="about-content">
            <h2>Our Story</h2>
            <p>Since 1985, Hussam Treasures has been a curator of fine antiques and historical artifacts. Each piece in our collection tells a unique story and carries the charm of bygone eras.</p>
        </div>
    </section>

    <div class="section-divider"></div>

    <section id="contact" class="contact">
        <h2>Contact Us</h2>
        <div class="contact-content">
            <div class="contact-info">
                <p><i class="fas fa-map-marker-alt"></i> 123 Vintage Street, Old Town</p>
                <p><i class="fas fa-phone"></i> (567) 560-0328</p>
                <p><i class="fas fa-envelope"></i> hussam@alshamalia.net</p>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <footer>
        <p>&copy; 2024, Hussam Treasures. All rights reserved.</p>
        <p>Designed and Developed by Talal Alshamalia.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html> 