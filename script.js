import { db } from "./firebase-config.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Variable to hold base prices
let basePrices = {};

// Fetch base prices from JSON file
fetch('carBasePrices.json')
    .then(response => response.json())
    .then(data => {
        basePrices = data;
        console.log("Base prices loaded:", basePrices);
    })
    .catch(error => console.error("Error loading base prices:", error));

// Function to add a car listing to Firestore
async function addCarListing(car) {
  try {
    const docRef = await addDoc(collection(db, "carListings"), car);
    console.log("Car added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding car:", error);
  }
}

// Function to fetch car listings in real-time from Firestore
function fetchCarListingsRealTime() {
  const listingsContainer = document.getElementById("car-listings");

  if (!listingsContainer) {
    return; // Exit the function if the car-listings element doesn't exist
  }

  listingsContainer.innerHTML = ""; // Clear previous listings

  onSnapshot(collection(db, "carListings"), (snapshot) => {
    listingsContainer.innerHTML = ""; // Clear current listings on update

    snapshot.forEach((doc) => {
      const car = doc.data();
      const carElement = document.createElement("div");
      carElement.classList.add("car-listing");
      carElement.innerHTML = `
        <h3>${car.brand} ${car.model}</h3>
        <p>Year: ${car.year}</p>
        <p>Price: $${car.price}</p>
      `;
      listingsContainer.appendChild(carElement);
    });
  });
}

// Function to predict car price based on user input
function predictPrice() {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = parseInt(document.getElementById('year').value);
    const mileage = parseInt(document.getElementById('mileage').value);
    const condition = document.getElementById('condition').value;

    const key = `${make} ${model}`;
    const basePrice = basePrices[key];

    if (!basePrice) {
        document.getElementById('priceResult').textContent = "Car model not found in the database.";
        return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const depreciationPerYear = 1000;
    const mileageDeductionRate = 0.05;
    const conditionAdjustment = condition === "New" ? 5000 : 0;

    let estimatedPrice = basePrice;
    estimatedPrice -= age * depreciationPerYear;
    estimatedPrice -= mileage * mileageDeductionRate;
    estimatedPrice += conditionAdjustment;

    // Set the minimum price to 0 if the calculated estimated price is negative
    estimatedPrice = estimatedPrice < 0 ? 0 : estimatedPrice;

    document.getElementById('priceResult').textContent = `Estimated Price: $${estimatedPrice.toFixed(2)}`;
}

// Check if the page has a predict button and attach the predictPrice function
document.addEventListener("DOMContentLoaded", function() {
    const predictButton = document.getElementById("predictButton");
    if (predictButton) {
        predictButton.addEventListener("click", predictPrice);
    }

    // Call the real-time function only if it's relevant to the page
    fetchCarListingsRealTime();
});
