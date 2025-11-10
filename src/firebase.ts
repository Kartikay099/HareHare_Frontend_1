// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6Hh-y1GXV7UAY07rgu2rQXaKAgQHrWCk",
  authDomain: "registration-75dd5.firebaseapp.com",
  databaseURL: "https://registration-75dd5-default-rtdb.firebaseio.com",
  projectId: "registration-75dd5",
  storageBucket: "registration-75dd5.firebasestorage.app",
  messagingSenderId: "864371654923",
  appId: "1:864371654923:web:057edcf49a1518ff49e20e",
  measurementId: "G-TM6F7L5D38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ✅ ADD THESE EXPORTS at the end of the file
export { app, auth, analytics };
export default app;