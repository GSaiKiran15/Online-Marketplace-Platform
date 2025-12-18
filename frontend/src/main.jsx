import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAYCQ7D7I6pBgtnzQawYxMXGhxdWmNV5dI",
  authDomain: "marketplace-3df91.firebaseapp.com",
  projectId: "marketplace-3df91",
  storageBucket: "marketplace-3df91.firebasestorage.app",
  messagingSenderId: "366295133070",
  appId: "1:366295133070:web:067ac5fde4dfc5eea592df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)