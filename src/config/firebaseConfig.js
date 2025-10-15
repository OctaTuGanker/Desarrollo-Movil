import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxqyeeby04jJje3LZPLr5P6C6F9EUr6MU",
  authDomain: "mobilestart-866ff.firebaseapp.com",
  projectId: "mobilestart-866ff",
  storageBucket: "mobilestart-866ff.firebasestorage.app",
  messagingSenderId: "74014445703",
  appId: "1:74014445703:web:0c90b1cf8051e296036822"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };

