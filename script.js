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
    const make = document.getElementById('make').value.trim().toLowerCase();
    const model = document.getElementById('model').value.trim().toLowerCase();
    const year = parseInt(document.getElementById('year').value);
    const mileage = parseInt(document.getElementById('mileage').value);
    const condition = document.getElementById('condition').value;

    // Create a case-insensitive key
    const key = `${make} ${model}`;

    // Convert basePrices keys to lowercase for case-insensitive lookup
    const basePrice = basePrices[key] || basePrices[Object.keys(basePrices).find(k => k.toLowerCase() === key)];

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

// Fetch and display customer reviews
function fetchCustomerReviews() {
    const reviewsCarousel = document.getElementById("reviews-carousel");

    if (!reviewsCarousel) return; // Exit if the reviews-carousel element doesn't exist

    onSnapshot(collection(db, "customerReviews"), (snapshot) => {
        reviewsCarousel.innerHTML = ""; // Clear current reviews

        snapshot.forEach((doc) => {
            const review = doc.data();
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");

            reviewCard.innerHTML = `
                <img src="${review.image || 'https://via.placeholder.com/50'}" alt="User Avatar">
                <h4>${review.name || "Anonymous"}</h4>
                <p>${review.feedback}</p>
                <div class="stars">${"⭐".repeat(review.rating || 0)}</div>
            `;

            reviewsCarousel.appendChild(reviewCard);
        });
    });
}

// Handle Review Form Submission on the write-review.html page
document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const rating = parseInt(document.getElementById("rating").value);
            const feedback = document.getElementById("feedback").value.trim();
            const date = document.getElementById("date").value;

            if (name && rating && feedback && date) {
                try {
                    await addDoc(collection(db, "customerReviews"), {
                        name,
                        rating,
                        feedback,
                        date,
                        timestamp: new Date()
                    });
                    alert("Thank you for your review!");
                    reviewForm.reset(); // Clear the form after submission
                    window.location.href = "index.html"; // Redirect back to home
                } catch (error) {
                    console.error("Error submitting review:", error);
                    alert("Failed to submit your review. Please try again.");
                }
            } else {
                alert("Please fill out all fields.");
            }
        });
    }
});

// Call relevant functions on page load
document.addEventListener("DOMContentLoaded", function () {
    const predictButton = document.getElementById("predictButton");
    if (predictButton) {
        predictButton.addEventListener("click", predictPrice);
    }

    // Call the real-time function only if it's relevant to the page
    fetchCarListingsRealTime();
    fetchCustomerReviews();
});
