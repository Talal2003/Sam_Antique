<?php
session_start();

// Check if user is not logged in as admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Redirect to login page
    header('Location: admin-login.php');
    exit();
}
?> 