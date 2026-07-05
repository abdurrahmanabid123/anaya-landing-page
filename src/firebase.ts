import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFHW2wnOr-IOPgcy3_rZ6BXK_FIUCqEtE",
  authDomain: "anaya-tours-landing.firebaseapp.com",
  projectId: "anaya-tours-landing",
  storageBucket: "anaya-tours-landing.firebasestorage.app",
  messagingSenderId: "327548108545",
  appId: "1:327548108545:web:67bed23af60d12db576500",
  measurementId: "G-J4LW5L9YQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Firestore Database
export const db = getFirestore(app);