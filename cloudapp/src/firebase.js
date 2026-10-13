import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhNTctfVXM0X45-yAUhSfBKgBpWjPNZL8",
  authDomain: "cloudapp-3163d.firebaseapp.com",
  projectId: "cloudapp-3163d",
  storageBucket: "cloudapp-3163d.firebasestorage.app",
  messagingSenderId: "650115806165",
  appId: "1:650115806165:web:be2252713c89ca88a2035c",
  measurementId: "G-9DR0YCXV5N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
