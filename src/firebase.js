import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAPNj6TvtNzwE771UIcuBXt1nd_hBUKNmE",
    authDomain: "whatsapp-clone-reactjs-1d9af.firebaseapp.com",
    projectId: "whatsapp-clone-reactjs-1d9af",
    storageBucket: "whatsapp-clone-reactjs-1d9af.appspot.com",
    messagingSenderId: "679896260226",
    appId: "1:679896260226:web:529d12ecdfb5693895de9b"
  };

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

const storage = firebase.storage();

export {db, auth, provider, storage};