// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVdtDVRZvgiUtN5nQtAZE2SgiJb6JxVkM",
  authDomain: "bdaybuddy-auth.firebaseapp.com",
  projectId: "bdaybuddy-auth",
  storageBucket: "bdaybuddy-auth.appspot.com",
  messagingSenderId: "383844094953",
  appId: "1:383844094953:web:c12022243213871cea7178",
  measurementId: "G-MPZE21K5ZX"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);