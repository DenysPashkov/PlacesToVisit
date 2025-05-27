import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Place } from "../models/Place";
import Modal from "./modal.js";
import {
  doc,
  getDoc,
  type Firestore,
} from "firebase/firestore";

export default function SideBar({
  places,
  setPlaces,
  db,
}: {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  db: Firestore | null;
}) {
  const [distances, setDistances] = useState<{ [placeId: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

  function toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  function haversineDistance(
    coord1: { lat: number; lon: number },
    coord2: { lat: number; lon: number }
  ): number {
    const R = 6371;
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Funzione che calcola la distanza dall'utente
  function getDistanceFromUser(destination: {
    lat: string;
    lon: string;
  }): Promise<number> {
    const lat = parseFloat(destination.lat);
    const lon = parseFloat(destination.lon);
    const destinationNumber = { lat, lon };
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          const distance = haversineDistance(userCoords, destinationNumber);
          resolve(distance);
        },
        () => resolve(NaN) // Return NaN if geolocation fails
      );
    });
  }

  useEffect(() => {
    async function fetchDistances() {
      try {
        const results = await Promise.all(
          places.map(async (place) => {
            const distance = await getDistanceFromUser({
              lat: place.location.lat,
              lon: place.location.lon,
            });
            return { id: place.id, distance };
          })
        );

        const distanceMap: { [placeId: string]: number } = {};
        results.forEach(({ id, distance }) => {
          distanceMap[id] = distance;
        });

        setDistances(distanceMap);
      } catch (error) {
        console.error("Failed to fetch distances:", error);
      }
    }

    if (places.length > 0) {
      fetchDistances();
    }
  }, [places]);

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
                  src={place.image}
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
          saveButtonText="Chiudi"
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
              <span>{selectedPlace.location.lat}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Longitudine</span>
              <span>{selectedPlace.location.lon}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Telefono</span>
              <span>{selectedPlace.phoneNumber || "Non disponibile"}</span>
            </div>
            <span className="font-semibold">Orari di apertura</span>
            {selectedPlace.workingHour &&
            selectedPlace.workingHour.length > 0 ? (
              selectedPlace.workingHour.map((dayHour, index) => {
                const [day, hours] = dayHour.split(": ");
                return (
                  <div
                    key={index}
                    className="flex justify-between text-gray-600 text-sm"
                  >
                    <span>{day}:</span>
                    <span>{hours}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-gray-500">Non disponibile</span>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
