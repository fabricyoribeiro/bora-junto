// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbFbTz56pgQ9Zoc3XAuv2788GwSgpHLR0",
  authDomain: "borajunto-2d1f7.firebaseapp.com",
  projectId: "borajunto-2d1f7",
  storageBucket: "borajunto-2d1f7.appspot.com",
  messagingSenderId: "402360966907",
  appId: "1:402360966907:web:408a48767b5fde2e475a5e",
  measurementId: "G-6512L3QJHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

// export const db = getFirestore(app);

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     return signInWithEmailAndPassword(auth, email, password);
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });