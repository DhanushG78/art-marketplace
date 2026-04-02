import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1STYj_mbbtLRtBXi5tBCh4d9bWJNpQBk",
  authDomain: "art-and-handmade-marketplace.firebaseapp.com",
  projectId: "art-and-handmade-marketplace",
  storageBucket: "art-and-handmade-marketplace.firebasestorage.app",
  messagingSenderId: "99715775853",
  appId: "1:99715775853:web:baa1db5bb2b32529c32e64",
};

// Prevent re-initialisation in hot-reload (Next.js dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
