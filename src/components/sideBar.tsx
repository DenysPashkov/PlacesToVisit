import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Place } from "../models/Place";
import { SidebarCardModal } from "./SidebarCardModal.js";
import { SidebarCard } from "./SidebarCard.js";
import { doc, getDoc, type Firestore } from "firebase/firestore";

export default function SideBar({
  places,
  setPlaces,
  db,
  currentPosition,
}: {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  db: Firestore | null;
  currentPosition: [number, number] | null;
}) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [query, setQuery] = useState("");
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);

  // Function to fetch places from Firestore
  // It retrieves the document with the specified ID and extracts the Places array
  function fetchData() {
    if (db) {
      const docRef = doc(db, "LocationsStoring", "4IZszzf7m4xFrLQrGEcr");
      getDoc(docRef)
        .then((querySnapshot: { data: () => any }) => {
          const data = querySnapshot.data();
          return data?.Places as any[];
        })
        .then((places) => {
          const constructedPlaces = places.map((place) => {
            return Place.constructorJson(place);
          });
          setPlaces(constructedPlaces);
          setAllPlaces(constructedPlaces);
        });
    } else {
      console.error("Firestore is not initialized.");
    }
  }

  // Filter places at every changes
  useEffect(() => {
    if (!query.trim()) {
      setPlaces(allPlaces); // reset
    } else {
      const filtered = allPlaces.filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
      setPlaces(filtered);
    }
  }, [query, allPlaces]);
  // Fetch places from Firestore when the component mounts or when db changes
  // This effect runs only once when the component mounts or when the db changes
  useEffect(() => {
    fetchData();
  }, [db]);

  return (
    <>
      <aside className="w-100 bg-white rounded-2xl shadow-xl p-6 h-[90vh] pointer-events-auto">
        <div className="mb-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <input
            type="search"
            placeholder="Cerca..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        {places.length > 0 ? (
          <nav className="flex flex-col gap-3">
            {places.map((place) => (
              <SidebarCard
                key={place.id}
                place={place}
                setSelectedPlace={setSelectedPlace}
                currentPosition={currentPosition}
              />
            ))}
          </nav>
        ) : (
          <p className="text-gray-500">Nessun posto trovato.</p>
        )}
      </aside>
      {selectedPlace && (
        <SidebarCardModal
          setSelectedPlace={setSelectedPlace}
          selectedPlace={selectedPlace}
          db={db}
          places={places}
          setPlaces={setPlaces}
        />
      )}
    </>
  );
}
