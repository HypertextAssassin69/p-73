import firebase from "firebase"
require('@firebase/firestore');
const firebaseConfig = {
    apiKey: "AIzaSyAIjyl9UKBl_1mBITyL52_kPePWo1qG4Ic",
    authDomain: "willy-library-6da3f.firebaseapp.com",
    databaseURL: "https://willy-library-6da3f-default-rtdb.firebaseio.com",
    projectId: "willy-library-6da3f",
    storageBucket: "willy-library-6da3f.appspot.com",
    messagingSenderId: "122542752346",
    appId: "1:122542752346:web:a8c10b853d31b188ae4e63"
  };
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig)
  export default firebase.database();