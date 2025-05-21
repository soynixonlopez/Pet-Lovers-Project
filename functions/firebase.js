// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbg5nxrEEPuDbfohOmbn8eJVtYPsdUhtI",
  authDomain: "expo-tech-projects.firebaseapp.com",
  projectId: "expo-tech-projects",
  storageBucket: "expo-tech-projects.firebasestorage.app",
  messagingSenderId: "122667485782",
  appId: "1:122667485782:web:a92ee56578e18c227049f7",
  measurementId: "G-0XG95LM4C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the Firebase instances
export { app, analytics, auth, db, storage }; 