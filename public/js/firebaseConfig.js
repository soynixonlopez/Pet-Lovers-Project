// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq9Vwd_vbd3JzEJ--UbSzbhGrVxJshhhw",
  authDomain: "expo-project-98483.firebaseapp.com",
  projectId: "expo-project-98483",
  storageBucket: "expo-project-98483.firebasestorage.app",
  messagingSenderId: "93909768353",
  appId: "1:93909768353:web:728e45d483fd3dc0b0b8e0",
  measurementId: "G-H5G01Q2PGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase services
export { auth, db }; 