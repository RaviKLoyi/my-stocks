import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase Web config is public by design (it is not a secret). Defaults are
// provided so the site also works when build-time VITE_FIREBASE_* vars are not
// set, e.g. in a hosting integration that does not forward env vars.
const defaultConfig = {
  apiKey: "AIzaSyCjyUiwMKeFXIGN-q0YzLxOB0FIKHSpeAY",
  authDomain: "rupeefarm-80634.firebaseapp.com",
  projectId: "rupeefarm-80634",
  storageBucket: "rupeefarm-80634.firebasestorage.app",
  messagingSenderId: "240289199831",
  appId: "1:240289199831:web:7235c813d3644e74316292",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const db = getFirestore(app);
