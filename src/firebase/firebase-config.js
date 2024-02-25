import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getFunctions} from 'firebase/functions'

const firebaseConfig = {
  apiKey: "AIzaSyAO2XprC5TT-9kaDi3AtEUkyTCDgfmJs_E",
  authDomain: "law-law-law.firebaseapp.com",
  projectId: "law-law-law",
  storageBucket: "law-law-law.appspot.com",
  messagingSenderId: "591265268568",
  appId: "1:591265268568:web:0318c8ade15f1244aa1b2d",
  measurementId: "G-JQ7J0TKMRC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export {signOut}
export const storage = getStorage(app);
export const functions = getFunctions(app);