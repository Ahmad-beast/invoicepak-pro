import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project configuration
// Get these values from Firebase Console > Project Settings > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDrz0HMVDphgu9c9jWEOlha83fMZW-lwyc",
  authDomain: "invoicepk-2fcfa.firebaseapp.com",
  projectId: "invoicepk-2fcfa",
  storageBucket: "invoicepk-2fcfa.firebasestorage.app",
  messagingSenderId: "952507478876",
  appId: "1:952507478876:web:33bf93827c1eefabb14799",
  measurementId: "G-VXGH01QX8P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set persistence to LOCAL (survives browser refresh)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});
