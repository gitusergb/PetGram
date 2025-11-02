import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  apiKey: "AIzaSyCaX8rLzlaNTpXs0Eo5uy0kN0wyUQkvKUE",
  authDomain: "petigram7.firebaseapp.com",
  databaseURL: "https://petigram7-default-rtdb.firebaseio.com/",
  projectId: "petigram7",
  storageBucket: "petigram7.firebasestorage.app",
  messagingSenderId: "933005931897",
  appId: "1:933005931897:web:1d203ecfe4c9cc6fa86ba8",
  measurementId: "G-CSNJLLB0SL"
};

// Initialize Firebase
let app;
let auth;
let database;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Realtime Database and get a reference to the service
  database = getDatabase(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { auth, database };
