// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBdlMwbg5C4_Q4QuFxzAiDKthjqsYq0JgI",
    authDomain: "sarkar-sathi.firebaseapp.com",
    projectId: "sarkar-sathi",
    storageBucket: "sarkar-sathi.firebasestorage.app",
    messagingSenderId: "258942256832",
    appId: "1:258942256832:web:64dc13728f11ffa9250f25",
    measurementId: "G-KBN1ZS97PH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);