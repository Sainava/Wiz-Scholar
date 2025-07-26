import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDQGERTMKdUxHoiKFvdoQERMmWJWn3Og38",
  authDomain: "wiz-scholar.firebaseapp.com",
  projectId: "wiz-scholar",
  storageBucket: "wiz-scholar.firebasestorage.app",
  messagingSenderId: "286971311931",
  appId: "1:286971311931:web:e6a35ce235b0f56918291e"
};

export const app = initializeApp(firebaseConfig);