<?php
require 'db.php'; // Include your database connection file

// Fetch unique categories from the 'book' table
$sql = "SELECT DISTINCT category FROM book WHERE category IS NOT NULL AND category != ''";
$result = $conn->query($sql);

// Prepare the categories array
$categories = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = ['name' => $row['category']];
    }
}

// Return categories as JSON
header('Content-Type: application/json');
echo json_encode($categories);

$conn->close();
?>
