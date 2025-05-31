// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbg5nxrEEPuDbfohOmbn8eJVtYPsdUhtI",
  authDomain: "expo-tech-projects.firebaseapp.com",
  projectId: "expo-tech-projects",
  storageBucket: "expo-tech-projects.firebasestorage.app",
  messagingSenderId: "122667485782",
  appId: "1:122667485782:web:a6621378fd4673557049f7",
  measurementId: "G-210YWSZ2EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };