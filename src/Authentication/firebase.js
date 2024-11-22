// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4l2ROrqIegCpneBMgKeInFw6MfwAplmA",
  authDomain: "se-events-platform.firebaseapp.com",
  projectId: "se-events-platform",
  storageBucket: "se-events-platform.firebasestorage.app",
  messagingSenderId: "925538758004",
  appId: "1:925538758004:web:7fe9ebd770157f87845021",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default app;
