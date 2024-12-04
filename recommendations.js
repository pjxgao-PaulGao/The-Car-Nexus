let basePrices = {};

// Load car data from JSON file
fetch("carBasePrices.json")
    .then((response) => response.json())
    .then((data) => {
        basePrices = data;
        console.log("Base prices loaded:", basePrices);
    })
    .catch((error) => console.error("Error loading base prices:", error));

// Function to recommend cars
function recommendCars() {
    const purpose = document.getElementById("purpose").value;
    const riders = parseInt(document.getElementById("riders").value);
    const mileage = parseInt(document.getElementById("mileage").value);
    const recommendationsDiv = document.getElementById("recommendations");

    // Clear previous recommendations
    recommendationsDiv.innerHTML = "";

    if (!purpose || isNaN(riders) || isNaN(mileage)) {
        recommendationsDiv.innerHTML = "<p style='color: red;'>Please fill out all fields.</p>";
        return;
    }

    // Define recommendation rules
    const recommendationRules = {
        School: ["Toyota Corolla", "Honda Civic", "Hyundai Elantra"],
        "Office Commute": ["Toyota Camry", "Honda Accord", "Hyundai Sonata"],
        Uber: ["Toyota Prius", "Honda Insight", "Nissan Altima"],
        Family: ["Toyota Highlander", "Honda Pilot", "Ford Explorer"],
    };

    const possibleCars = recommendationRules[purpose];
    const randomCars = [];

    // Randomly pick 3 cars from the possible list
    while (randomCars.length < 3 && possibleCars.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleCars.length);
        const car = possibleCars.splice(randomIndex, 1)[0]; // Remove selected car
        randomCars.push(car);
    }

    // Display recommendations
    randomCars.forEach((car) => {
        const price = basePrices[car] || "Price not available";
        recommendationsDiv.innerHTML += `<p style="color: green;">${car}: $${price}</p>`;
    });
}
