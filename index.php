

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="logo/vls_logo.jpg">
    <title>LIPA CITY PUBLIC LIBRARY</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

    <link href="LCPL/assets/css/main.css" rel="stylesheet">

    <style>
    
    </style>

</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">LIPA CITY PUBLIC LIBRARY</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div id="hero-section">
        <div class="container hero-content">
            <h1 class="display-4 mb-3">Welcome to Lipa City Public Library</h1>
            <p class="lead mb-4">A place to discover, learn, and grow. Join us today!</p>
            <a href="LCPL/admin-login.php" class="button btn btn-primary mx-2">Admin Login</a>
<a href="LCPL/logbook.php" class="button btn btn-outline-secondary mx-2">LogBook</a>

        </div>
    </div>

    <!-- Footer Section -->
    

    <!-- Bootstrap JS Bundle (with Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const images = [
            'LCPL/assets/img/libpic1.jpg',
            'LCPL/assets/img/libpic2.jpg',
            'LCPL/assets/img/libpic3.jpg' // Add more images as needed
        ];

        let currentIndex = 0;
        const heroSection = document.getElementById('hero-section');

        function changeBackgroundImage() {
            heroSection.style.backgroundImage = `url(${images[currentIndex]})`;
            currentIndex = (currentIndex + 1) % images.length;
        }

        // Initial background image
        changeBackgroundImage();

        // Change background every 3 seconds
        setInterval(changeBackgroundImage, 3000);
    </script>

</body>
</html>
