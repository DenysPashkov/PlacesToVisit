// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// NON inizializziamo subito Firebase qui, ma solo quando initFirebase viene chiamato

let auth = null;
let provider = null;

function initFirebase(config) {
  if (!getApps().length) {
    const app = initializeApp(config);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  }
  return { auth, provider };
}

export { initFirebase };

