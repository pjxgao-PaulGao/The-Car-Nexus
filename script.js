let suggestions = [];

// Load saved cars from localStorage
const savedCars = JSON.parse(localStorage.getItem('cars')) || [];
suggestions = savedCars.map(car => ({
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    condition: car.condition,
    color: car.color,
    mileage: car.mileage,
    description: car.description
}));

// Function to filter suggestions based on user input
function searchCar() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const filteredSuggestions = suggestions.filter(car => {
        const carInfo = `${car.brand} ${car.model} ${car.year}`.toLowerCase();
        return carInfo.includes(input);
    });

    // Display the top 5 suggestions
    displaySuggestions(filteredSuggestions.slice(0, 5));
}

// Function to display the filtered suggestions
function displaySuggestions(suggestions) {
    const suggestionBox = document.getElementById('suggestion-box');
    suggestionBox.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = `${suggestion.brand} ${suggestion.model} ${suggestion.year}`;
        suggestionBox.appendChild(suggestionItem);

        // Add event listener to handle clicks on suggestions
        suggestionItem.addEventListener('click', () => {
            // Save the selected car details to localStorage
            const selectedCar = savedCars.find(car => 
                car.brand === suggestion.brand && 
                car.model === suggestion.model && 
                car.year === suggestion.year
            );
            localStorage.setItem('selectedCar', JSON.stringify(selectedCar));

            // Redirect to the car details page
            window.location.href = 'car-details.html';
        });
    });
}
