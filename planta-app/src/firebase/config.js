// src/firebase/config.js
import { initializeApp} from 'firebase/app';
import { getAuth }  from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCV4lr4OxZOA7F9JZlLsuDTYP8vofhwca4",
  authDomain: "tienda-app-teleco.firebaseapp.com",
  databaseURL: "https://tienda-app-teleco-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tienda-app-teleco",
  storageBucket: "tienda-app-teleco.firebasestorage.app",
  messagingSenderId: "749350754463",
  appId: "1:749350754463:web:ecff9247725263de8caaaa"
};

const app = initializeApp(firebaseConfig)


export const auth     = getAuth(app);
export const database = getDatabase(app);
