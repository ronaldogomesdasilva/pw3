import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkiuSvnq7FrG24bFh3-DAvX48SxyiVh8E",
  authDomain: "testpwiii.firebaseapp.com",
  projectId: "testpwiii",
  storageBucket: "testpwiii.firebasestorage.app",
  messagingSenderId: "902384801352",
  appId: "1:902384801352:web:aa4c54b3edc5870a966a7d",

  // URL do Realtime Database
  databaseURL: "https://testpwiii-default-rtdb.firebaseio.com"
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