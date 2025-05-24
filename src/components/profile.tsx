import { useState, useEffect } from "react";
import { auth, provider } from "../firebase.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

function ProfileMenu({
  user,
  onLogin,
  onLogout,
}: {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="absolute mt-2 right-0 bg-white rounded-xl shadow w-40 z-10">
      <ul className="text-left text-sm text-gray-700">
        <li className="px-4 py-2 cursor-pointer">Settings</li>

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
  console.log("@@@@@ image name: ", user?.photoURL);
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

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listener che controlla se c'è un utente loggato già attivo
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("Utente già loggato:", currentUser);
      } else {
        setUser(null);
        console.log("Nessun utente loggato");
      }
    });

    // Cleanup del listener quando il componente si smonta
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("Utente loggato:", result.user);
    } catch (error) {
      console.error("Errore nel login con Google", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Utente disconnesso");
    } catch (error) {
      console.error("Errore nel logout", error);
    }
  };

  return (
    <details className="relative">
      <ProfileButton user={user} />
      <ProfileMenu
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />
    </details>
  );
}
