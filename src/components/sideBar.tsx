import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Place } from "../models/Place";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  type Firestore,
} from "firebase/firestore";
import { useEffect } from "react";

export default function SideBar({
  places,
  setPlaces,
  db,
}: {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  db: Firestore | null;
}) {
  function fetchData() {
    if (db) {
      const docRef = doc(db, "LocationsStoring", "4IZszzf7m4xFrLQrGEcr");
      getDoc(docRef)
        .then((querySnapshot) => {
          const data = querySnapshot.data();
          return data?.Places as any[];
        })
        .then((places) => {
          const constructedPlaces = places.map((place) => {
            return Place.constructorJson(place);
          });
          setPlaces(constructedPlaces);
        });
    } else {
      console.error("Firestore is not initialized.");
    }
  }
  useEffect(() => {
    fetchData();
  }, [db]);
  return (
    <>
      <aside className="w-100 bg-white rounded-2xl shadow-xl p-6 h-[90vh] ">
        <div className="mb-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <input
            type="search"
            placeholder="Cerca..."
            className="w-full pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        <button onClick={fetchData}>fetch</button>

        {places.length > 0 ? (
          <nav className="flex flex-col gap-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{place.name}</p>
                  <p className="text-sm text-gray-500">??? km</p>
                </div>
              </div>
            ))}
          </nav>
        ) : (
          <p className="text-gray-500">Nessun posto trovato.</p>
        )}
      </aside>
    </>
  );
}
