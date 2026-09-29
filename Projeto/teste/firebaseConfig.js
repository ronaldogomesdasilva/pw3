import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA_iVd6a32vqFL0VqLv3oPs61Yw70HzhPM",
  authDomain: "projeto-teste-b1106.firebaseapp.com",
  projectId: "projeto-teste-b1106",
  storageBucket: "projeto-teste-b1106.firebasestorage.app",
  messagingSenderId: "565887251942",
  appId: "1:565887251942:web:1f0896ab06086cf1b01227",
  databaseURL: "https://projeto-teste-b1106-default-rtdb.firebaseio.com"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Authentication
const auth = getAuth(app);

// Inicializa o Realtime Database
const database = getDatabase(app);

// Exporta os serviços
export {
  app,
  auth,
  database
};