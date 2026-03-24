// src/firebase/firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
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

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

function initAuth(): Auth {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  // ✅ On React Native: initializeAuth FIRST, so persistence is applied.
  // If auth is already initialized (Fast Refresh), initializeAuth throws -> fall back to getAuth.
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e: any) {
    return getAuth(app);
  }
}

export const auth = initAuth();
