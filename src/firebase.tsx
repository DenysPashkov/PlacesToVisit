// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// NON inizializziamo subito Firebase qui, ma solo quando initFirebase viene chiamato

let auth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;
let db: Firestore | null = null;

function initFirebase(config: any): {
  auth: Auth;
  provider: GoogleAuthProvider;
  db: Firestore;
} | null {
  if (!getApps().length) {
    const app = initializeApp(config);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    db = getFirestore(app);
    return { auth, provider, db };
  }
  return null;
}

export { initFirebase };
