import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import Modal from "./modal.js";
import { initFirebase } from "../firebase";
import type { Firestore } from "firebase/firestore";

function ProfileMenu({
  user,
  onLogin,
  onLogout,
  onSettingsClick,
  setDB,
}: {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  setDB?: (db: any) => void;
}) {
  return (
    <div className="absolute mt-2 right-0 bg-white rounded-xl shadow w-40 z-10">
      <ul className="text-left text-sm text-gray-700">
        <li className="px-4 py-2 cursor-pointer" onClick={onSettingsClick}>
          Settings
        </li>

        {!user ? (
          <li onClick={onLogin} className="px-4 py-2 cursor-pointer">
            Login
          </li>
        ) : (
          <>
            <li className="px-4 py-2">{user.displayName}</li>
            <li
              onClick={onLogout}
              className="px-4 py-2 cursor-pointer text-red-600"
            >
              Logout
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

function ProfileButton({ user }: { user: User | null }) {
  return (
    <summary className="cursor-pointer bg-white w-24 h-24 rounded-full overflow-hidden shadow flex items-center justify-center hover:shadow-lg transition">
      <img
        src={user?.photoURL ?? "https://placehold.co/100"}
        alt={user?.displayName ?? ""}
        className="w-full h-full object-cover"
      />
    </summary>
  );
}

export default function Profile({
  setDB,
}: {
  setDB: (db: Firestore | null) => void;
}) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [provider, setProvider] = useState<GoogleAuthProvider | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    api_key: "",
    auth_domain: "",
    project_id: "",
    storage_bucket: "",
    messaging_sender_id: "",
    app_id: "",
  });
  const profileFields = [
    { name: "api_key", label: "API Key" },
    { name: "auth_domain", label: "Auth Domain" },
    { name: "project_id", label: "Project ID" },
    { name: "storage_bucket", label: "Storage Bucket" },
    { name: "messaging_sender_id", label: "Messaging Sender ID" },
    { name: "app_id", label: "App ID" },
  ];

  //Inizializza Firebase con i dati in LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const config = JSON.parse(savedData);
      setProfileData(config);

      const firebaseInit = initFirebase({
        apiKey: config.api_key,
        authDomain: config.auth_domain,
        projectId: config.project_id,
        storageBucket: config.storage_bucket,
        messagingSenderId: config.messaging_sender_id,
        appId: config.app_id,
      });
      if (firebaseInit !== null) {
        const { auth, provider, db } = firebaseInit;
        setAuth(auth);
        setProvider(provider);
        setDB(db);
        return;
      }
      // setAuth(null);
      // setProvider(null);
      // setDB(null);
    }
  }, [showSettings]);

  //Funzione per gestire i cambi input
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  //Funzione per gestire il salvataggio
  function handleSave() {
    localStorage.setItem("profileData", JSON.stringify(profileData));
    console.log("Profilo salvato senza utente:", profileData);
    console.log("Profilo salvato:", profileData);
    setShowSettings(false);
  }

  //Monitora lo stato dell'autenticazione Firebase
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //Se l'utente è autenticato
      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      const savedData = localStorage.getItem(`profileData_${currentUser.uid}`);
      if (savedData) {
        setProfileData(JSON.parse(savedData));
      } else {
        setProfileData({
          api_key: "",
          auth_domain: "",
          project_id: "",
          storage_bucket: "",
          messaging_sender_id: "",
          app_id: "",
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  //Funzione Login
  const handleGoogleLogin = async () => {
    if (!auth || !provider) {
      console.error("Firebase non inizializzato");
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("Loggato!");
    } catch (error) {
      console.error(error);
      console.log("Non Loggato!");
    }
  };

  //Funzione Logout
  const handleLogout = async () => {
    if (!auth) {
      console.error("Firebase non inizializzato");
      return;
    }
    try {
      await signOut(auth);
      setUser(null);
      console.log("Sloggato!");
    } catch (error) {
      console.error(error);
      console.log("Non sloggato!");
    }
  };

  return (
    <>
      <details className="relative">
        <ProfileButton user={user} />
        <ProfileMenu
          user={user}
          onLogin={handleGoogleLogin}
          onLogout={handleLogout}
          onSettingsClick={() => setShowSettings(true)}
        />
      </details>
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSave}
        title="Impostazioni profilo"
      >
        <div className="flex flex-col space-y-4">
          {profileFields.map(({ name, label }) => (
            <label key={name} className="text-sm font-medium text-gray-700">
              {label}
              <input
                type="text"
                name={name}
                value={(profileData as any)[name]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Inserisci ${label}`}
              />
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
