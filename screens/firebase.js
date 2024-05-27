// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDrSb4tLwIq0Oh_7bsKst95Po3n20-i10Q",
    authDomain: "gym-market.firebaseapp.com",
    projectId: "gym-market",
    storageBucket: "gym-market.appspot.com",
    messagingSenderId: "229168445264",
    appId: "1:229168445264:web:ed0c5ddc2aeaa463d29e55",
    measurementId: "G-WHN1M0P7KC"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
