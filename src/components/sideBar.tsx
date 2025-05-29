import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Place } from "../models/Place";
import Modal from "./modal.js";
import { type Firestore } from "firebase/firestore";
import defaultRestaurant from "../assets/restaurant-img-default.png";
import { firebaseManager } from "../models/FirebaseManager.js";

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
  const [distances, setDistances] = useState<{ [placeId: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Fetch places from Firestore when the component mounts or when db changes
  // This effect runs only once when the component mounts or when the db changes
  useEffect(() => {
    if (db === null) {
      return;
    }
    firebaseManager.fetchPlaces(db, (places) => {
      setPlaces(places);
    });
  }, [db]);

  // Function to convert degrees to radians
  // This is used in the Haversine formula to calculate distances
  function toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Haversine formula to calculate the distance between two coordinates, retun in kilometers
  function haversineDistance(
    coord1: [number, number],
    coord2: [number, number]
  ): number {
    const R = 6371;
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1[0])) *
        Math.cos(toRad(coord2[0])) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Function to calculate the distance from the user's current position to a destination
  // It takes the user's position and the destination's coordinates as input
  function getDistanceFromUser(
    myPosition: [number, number],
    destination: [number, number]
  ): number {
    const lat = destination[0];
    const lon = destination[1];
    const destinationNumber: [number, number] = [lat, lon];
    return haversineDistance(myPosition, destinationNumber);
  }

  // Fetch distances for each place from the user's current position, may can be optimized
  // to avoid recalculating if the current position hasn't changed
  // This effect runs whenever places or currentPosition changes
  useEffect(() => {
    if (currentPosition === null) {
      return;
    }

    async function fetchDistances(currentPosition: [number, number]) {
      const distancesArray = await Promise.all(
        places.map(async (place) => {
          const distance = await getDistanceFromUser(
            currentPosition,
            place.location
          );
          return { [place.id]: distance };
        })
      );

      // Merge array of objects into one object
      const distancesObj = distancesArray.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

      setDistances(distancesObj);
    }

    if (places.length > 0) {
      fetchDistances(currentPosition);
    }
  }, [places, currentPosition]);

  return (
    <>
      <aside className="w-100 bg-white rounded-2xl shadow-xl p-6 h-[90vh] pointer-events-auto">
        <div className="mb-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <input
            type="search"
            placeholder="Cerca..."
            className="w-full pl-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          />
        </div>
        {places.length > 0 ? (
          <nav className="flex flex-col gap-3">
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => {
                  setSelectedPlace(place);
                  setShowModal(true);
                }}
                className="cursor-pointer bg-white p-4 rounded-lg shadow-md border flex items-center gap-4 hover:bg-gray-50"
              >
                <img
                  src={place.image == "" ? defaultRestaurant : place.image}
                  alt={place.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{place.name}</p>
                  <p className="text-sm text-gray-500">
                    {distances[place.id] !== undefined
                      ? `${distances[place.id].toFixed(2)} km`
                      : "Calcolo..."}
                  </p>
                </div>
              </div>
            ))}
          </nav>
        ) : (
          <p className="text-gray-500">Nessun posto trovato.</p>
        )}
      </aside>
      {showModal && selectedPlace && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
          title={selectedPlace.name}
          actionButtonText="Chiudi"
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Distanza</span>
              <span>
                {distances[selectedPlace.id] !== undefined
                  ? `${distances[selectedPlace.id].toFixed(2)} km`
                  : "Calcolo..."}
              </span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Latitudine</span>
              <span>{selectedPlace.location[0]}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Longitudine</span>
              <span>{selectedPlace.location[1]}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Telefono</span>
              <span>{selectedPlace.phoneNumber || "Non disponibile"}</span>
            </div>
            <span className="font-semibold">Orari di apertura</span>
            <OpeningHourSection selectedPlace={selectedPlace} />
          </div>
        </Modal>
      )}
    </>
  );

  function OpeningHourSection({ selectedPlace }: { selectedPlace: Place }) {
    return (
      <>
        {" "}
        {selectedPlace.workingHour ? (
          Object.entries(selectedPlace.workingHour).map(([day, slots]) => (
            <div
              key={day}
              className="flex justify-between text-gray-600 text-sm"
            >
              <span className="capitalize">{day}:</span>
              <span>
                {slots.length > 0
                  ? slots.map((slot, i) => (
                      <span key={i}>
                        {slot.start}–{slot.end}
                        {i < slots.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "Closed"}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-500">Non disponibile</span>
        )}
      </>
    );
  }
}
