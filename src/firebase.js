// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmL9YKAIxZIjToPIt9vqQH_CWY5LLqHlU",
  authDomain: "beyti-home.firebaseapp.com",
  projectId: "beyti-home",
  storageBucket: "beyti-home.firebasestorage.app",
  messagingSenderId: "391660760226",
  appId: "1:391660760226:web:f78a16d864837f0355fbfb",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
