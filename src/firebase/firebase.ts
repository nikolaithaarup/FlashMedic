// src/firebase/firebase.ts
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL6Jm7196_80oBhAH9n1Zz7Qq8iKgUaf4",
  authDomain: "flashmedic-edf96.firebaseapp.com",
  projectId: "flashmedic-edf96",
  storageBucket: "flashmedic-edf96.firebasestorage.app",
  messagingSenderId: "1019339255388",
  appId: "1:1019339255388:web:323f184265e61cc301c099",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
