// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCt63ZBh6F-7P6_g4DR1lra-oFtnrONJ1g",
    authDomain: "hackduke-2025.firebaseapp.com",
    projectId: "hackduke-2025",
    storageBucket: "hackduke-2025.firebasestorage.app",
    messagingSenderId: "257545931864",
    appId: "1:257545931864:web:add04c8c13b6f573070e2d",
    measurementId: "G-0BF9PKVCET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);