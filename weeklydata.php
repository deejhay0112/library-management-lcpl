<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Database credentials
$host = "localhost";
$user = "u708474031_test";
$password = "Jedjelodex69";
$database = "u708474031_test";

// Connect to MySQL
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// SQL query to fetch data grouped by weeks for 2023 and 2024
$query = "
    SELECT YEAR(Date) AS year, WEEK(Date) AS week, COUNT(*) AS visitors
    FROM male_1
    WHERE YEAR(Date) IN (2023, 2024)
    GROUP BY YEAR(Date), WEEK(Date)
    ORDER BY YEAR(Date), WEEK(Date)
";

$result = $conn->query($query);

// Check if the query executed successfully
if (!$result) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return the result as JSON
echo json_encode($data);
$conn->close();
?>
