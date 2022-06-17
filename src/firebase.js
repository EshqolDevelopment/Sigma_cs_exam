import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyC3_Ex8W3N3VIXhFo7OseXuAURJG0hb92s",
    authDomain: "sigama-tests.firebaseapp.com",
    projectId: "sigama-tests",
    storageBucket: "sigama-tests.appspot.com",
    messagingSenderId: "749668023792",
    appId: "1:749668023792:web:e693a82f4246026e977135"
}


export const app = initializeApp(firebaseConfig)