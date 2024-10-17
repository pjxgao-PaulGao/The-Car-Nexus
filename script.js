// Function to search for a car (for demonstration purposes)
function searchCar() {
    let searchInput = document.getElementById("searchBar").value;
    alert("You searched for: " + searchInput);
}

// Function to submit a car for sale
function submitCar(event) {
    event.preventDefault(); // Prevent form from refreshing page
    let make = document.getElementById("make").value;
    let model = document.getElementById("model").value;
    let price = document.getElementById("price").value;
    let year = document.getElementById("year").value;

    alert("Car Submitted: " + make + " " + model + ", $" + price + ", Year: " + year);
}

// Function for sign up form
function signUp(event) {
    event.preventDefault(); // Prevent form from refreshing page
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    alert("Welcome, " + name + "! Your sign-up is complete.");
}
