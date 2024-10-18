let suggestions = [];

// Fetch car data from the JSON file
fetch('suggestions.json')
    .then(response => response.json())
    .then(data => {
        suggestions = data;
        console.log('Suggestions loaded:', suggestions); // Log to confirm suggestions are loaded
    })
    .catch(error => console.error('Error fetching suggestions:', error));

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
            document.getElementById('searchBar').value = suggestionItem.textContent;
            suggestionBox.innerHTML = ''; // Clear the suggestions
        });
    });
}
