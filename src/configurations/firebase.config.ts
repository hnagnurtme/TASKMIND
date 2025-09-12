import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBmP-DrCOPsSXfjAY3PmJ_O49XBoEU4tiA",
  authDomain: "taskmind-d69cf.firebaseapp.com",
  projectId: "taskmind-d69cf",
  storageBucket: "taskmind-d69cf.firebasestorage.app",
  messagingSenderId: "489847987128",
  appId: "1:489847987128:web:7accbd9b9929f237a84d4d",
  measurementId: "G-7R5V5ERC6V"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase app initialized:", JSON.stringify(app));

const analytics = getAnalytics(app);

const firestore = getFirestore(app);

const auth = getAuth(app);

export { auth, firestore as db , analytics };

