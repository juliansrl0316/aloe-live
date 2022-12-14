import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYXsLRaEugfUOTsB54X_Ei86XHqTAl7CI",
  authDomain: "clone-30742.firebaseapp.com",
  projectId: "clone-30742",
  storageBucket: "clone-30742.appspot.com",
  messagingSenderId: "490212316937",
  appId: "1:490212316937:web:25386102919acaf04965d8"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;
