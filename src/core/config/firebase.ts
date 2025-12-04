"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "./env";

// Configuración usando variables de entorno
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

// Inicializar Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

// Exportar Auth
export const FirebaseAuth = getAuth(FirebaseApp);
