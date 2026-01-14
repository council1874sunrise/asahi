import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ↓↓ ここにあなたのFirebase設定を貼り付けてください ↓↓
const firebaseConfig = {
  apiKey: "AIzaSyDHg5b8fdTjbvUwjyyj2V85gCilPTlb8aQ",
  authDomain: "asahi-f7189.firebaseapp.com",
  projectId: "asahi-f7189",
  storageBucket: "asahi-f7189.firebasestorage.app",
  messagingSenderId: "838314272930",
  appId: "1:838314272930:web:d04153d9fe6f3aa152cffb"
};

// ↑↑ ここまで ↑↑

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
