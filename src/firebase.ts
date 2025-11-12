// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

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

// Initialize App Check
let appCheck: AppCheck | null = null;

if (typeof window !== 'undefined') {
  // Solo inicializar App Check en el navegador
  try {
    // Para desarrollo: usar debug token específico
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
      // Debug token para desarrollo
      (globalThis as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || '3FC81B62-E7AF-4578-ACEC-170CF9A33D02';
      console.log('App Check: Usando debug token para desarrollo');
    }
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        import.meta.env.VITE_FIREBASE_RECAPTCHA_V3_SITE_KEY || '6LcG8wMsAAAAAOHGt00JjWrp_oIsUazEtCM75o8a'
      ),
      isTokenAutoRefreshEnabled: true
    });
    
    console.log('App Check inicializado correctamente con ReCaptcha v3');
  } catch (error) {
    console.warn('Error al inicializar App Check:', error);
    console.warn('La aplicación funcionará sin App Check por ahora');
  }
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Export App Check instance
export { appCheck };

export default app;