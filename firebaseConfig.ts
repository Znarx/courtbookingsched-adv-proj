import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA2Tm8Sgz196dSo_EQWhySfIXQMhFgZv5k",
  authDomain: "court-ddcb4.firebaseapp.com",
  projectId: "court-ddcb4",
  storageBucket: "court-ddcb4.firebasestorage.app",
  messagingSenderId: "1098600692948",
  appId: "1:1098600692948:web:19882046acc4f5d7040f41"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
