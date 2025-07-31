// Firebase config for web app
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

/*const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyCkeLL5m34UVj4_wRFJ3l1ytoHMqaM973M",
  authDomain: "xublimemobileapp.firebaseapp.com",
  projectId: "xublimemobileapp",
  storageBucket: "xublimemobileapp.firebasestorage.app",
  messagingSenderId: "268860731442",
  appId: "1:268860731442:web:d96ef846ced141b6740c2b",
  measurementId: "G-7GVHZ6ZSQM"
}
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
