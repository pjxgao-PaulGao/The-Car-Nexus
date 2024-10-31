// Import Firebase functions from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgyzi1oNLNIVL6byB5oFBsmF-2EU3NUUk",
  authDomain: "the-car-nexus-3cc5e.firebaseapp.com",
  projectId: "the-car-nexus-3cc5e",
  storageBucket: "the-car-nexus-3cc5e.appspot.com",
  messagingSenderId: "204707024268",
  appId: "1:204707024268:web:51a661de3432178fc0daa9",
  measurementId: "G-4VXCG14LKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
