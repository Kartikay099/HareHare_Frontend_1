import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3ez7BuH8Eiz5WssdEA2vt2iREMWIE7l8",
  authDomain: "harehare-d441a.firebaseapp.com",
  projectId: "harehare-d441a",
  storageBucket: "harehare-d441a.firebasestorage.app",
  messagingSenderId: "658810522358",
  appId: "1:658810522358:web:a53bbf998788e200f53ad7",
  measurementId: "G-MGY52VK6Q1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

/* ---------------------------------------------------
  🔥 1. Setup Invisible Recaptcha
--------------------------------------------------- */
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }
  return window.recaptchaVerifier;
};

/* ---------------------------------------------------
  🔥 2. Send OTP
--------------------------------------------------- */
export const sendOTP = async (phone: string) => {
  const appVerifier = setupRecaptcha();
  const fullPhone = `+91${phone}`;

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    fullPhone,
    appVerifier
  );

  window.confirmationResult = confirmationResult;
  return true;
};

/* ---------------------------------------------------
  🔥 3. Verify OTP
--------------------------------------------------- */
export const verifyOTP = async (otp: string) => {
  const result = await window.confirmationResult.confirm(otp);

  const firebaseUser = result.user;
  const idToken = await firebaseUser.getIdToken();

  return {
    uid: firebaseUser.uid,
    phone: firebaseUser.phoneNumber,
    idToken,
  };
};

export { app, auth, analytics };
export default app;
