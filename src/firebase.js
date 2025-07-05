import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBofNLrRwo4ZjKtyRjUSO-oR9_y4-rDfjw",
  authDomain: "joto-38d28.firebaseapp.com",
  projectId: "joto-38d28",
  storageBucket: "joto-38d28.appspot.com",
  messagingSenderId: "1038121010462",
  appId: "1:1038121010462:web:6dd59f4804b6c0e146f50f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
