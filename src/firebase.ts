// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAB5wpLeg3NiuklxUhv0G3heOS-O_DhCDU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "proyecto-final-basededatos-ecc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "proyecto-final-basededatos-ecc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "proyecto-final-basededatos-ecc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "274564221497",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:274564221497:web:3ce5ecd73ffbaf28781be8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LJYSD5Z2DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;