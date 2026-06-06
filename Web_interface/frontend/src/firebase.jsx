// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhe_MsIS3clpsRGG8JgCEK_TqjJtqvXJs",
  authDomain: "justicechatbot.firebaseapp.com",
  projectId: "justicechatbot",
  storageBucket: "justicechatbot.firebasestorage.app",
  messagingSenderId: "257480783064",
  appId: "1:257480783064:web:39b768065d32abff5a13ad"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);