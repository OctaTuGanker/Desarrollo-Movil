// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxqyeeby04jJje3LZPLr5P6C6F9EUr6MU",
  authDomain: "mobilestart-866ff.firebaseapp.com",
  projectId: "mobilestart-866ff",
  storageBucket: "mobilestart-866ff.firebasestorage.app",
  messagingSenderId: "74014445703",
  appId: "1:74014445703:web:0c90b1cf8051e296036822",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa Firestore
const db = getFirestore(app);

export { auth, db };