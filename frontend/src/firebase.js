// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2vyaNO5SDNgyk1ClAc3lozsWexsediLM",
    authDomain: "otp-system-b2166.firebaseapp.com",
    projectId: "otp-system-b2166",
    storageBucket: "otp-system-b2166.firebasestorage.app",
    messagingSenderId: "456734584010",
    appId: "1:456734584010:web:24b7c898c860f1a8055833",
    measurementId: "G-R5DH2S2VH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
