import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { GooglePlacesManager } from "../models/GooglePlacesManager";
import type { Place } from "../models/Place";
import { type Firestore } from "firebase/firestore";
import { firebaseManager } from "../models/FirebaseManager";

export default function CircleButton({
  setPlaces,
  db,
}: {
  setPlaces: (place: Place) => void;
  db: Firestore | null;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Function to add a new place to Firestore
  // It takes a Place object, converts it to JSON, and adds it to the "Places" array in the Firestore document

  const handleSearch = () => {
    const gpManager = new GooglePlacesManager();
    gpManager
      .findPlaceId(searchValue)
      .then((newPlace) => {
        if (newPlace === null) return;
        if (db === null) return;
        firebaseManager.addPlace(db, newPlace, (place) => setPlaces(place));
        return;
      })
      .catch((error) => {
        console.error("Error finding place:", error);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pointer-events-auto">
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
      {showSearch && (
        <div
          onClick={() => {
            setShowSearch(false);
            setSearchValue("");
          }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white  gap-4 rounded-xl shadow-xl w-full max-w-md relative p-6 flex flex-row items-center"
          >
            <div className="w-full relative my-2">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />

              <input
                type="search"
                placeholder="Cerca..."
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-10 pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => {
                if (searchValue != "") {
                  handleSearch();
                }
              }}
              className="w-20 h-10 bg-blue-500 text-white px-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
