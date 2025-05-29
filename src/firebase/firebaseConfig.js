// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();