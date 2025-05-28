// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOIXB4eTr6tiOCrGEvxodVRnFVFGPZE_g",
  authDomain: "expo-project-ee65e.firebaseapp.com",
  projectId: "expo-project-ee65e",
  storageBucket: "expo-project-ee65e.firebasestorage.app",
  messagingSenderId: "1031929210292",
  appId: "1:1031929210292:web:960f57d7a974279551bee1",
  measurementId: "G-Y3SPE7Y514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);