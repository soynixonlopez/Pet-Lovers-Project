// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);