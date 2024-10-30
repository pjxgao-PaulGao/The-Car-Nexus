import { db } from "./firebase-config.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
  listingsContainer.innerHTML = ""; // Clear previous listings

  // Set up real-time listener for Firestore
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

// Call the real-time function on page load
fetchCarListingsRealTime();
