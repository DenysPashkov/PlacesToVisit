import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Place } from "../models/Place";
import { doc, getDoc, type Firestore } from "firebase/firestore";
import defaultRestaurant from "../assets/restaurant-img-default.png";
import Modal from "../components/modal";
import StarRating from "../components/starRating";

export default function SideBar({
  places,
  setPlaces,
  db,
  currentPosition,
}: {
  places: Place[];
  setPlaces: (places: Place[]) => void;
  db: Firestore | null;
  currentPosition: { lat: number; lon: number } | null;
}) {
  const [distances, setDistances] = useState<{ [placeId: string]: number }>({});
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(0);

  // Function to fetch places from Firestore
  // It retrieves the document with the specified ID and extracts the Places array
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

  // Fetch places from Firestore when the component mounts or when db changes
  // This effect runs only once when the component mounts or when the db changes
  useEffect(() => {
    fetchData();
  }, [db]);

  // Function to convert degrees to radians
  // This is used in the Haversine formula to calculate distances
  function toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Haversine formula to calculate the distance between two coordinates, retun in kilometers
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

  // Function to calculate the distance from the user's current position to a destination
  // It takes the user's position and the destination's coordinates as input
  function getDistanceFromUser(
    myPosition: { lat: number; lon: number },
    destination: {
      lat: string;
      lon: string;
    }
  ): number {
    const lat = parseFloat(destination.lat);
    const lon = parseFloat(destination.lon);
    const destinationNumber = { lat, lon };
    return haversineDistance(myPosition, destinationNumber);
  }

  // Fetch distances for each place from the user's current position, may can be optimized
  // to avoid recalculating if the current position hasn't changed
  // This effect runs whenever places or currentPosition changes
  useEffect(() => {
    if (currentPosition === null) {
      return;
    }

    async function fetchDistances(currentPosition: {
      lat: number;
      lon: number;
    }) {
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
      {/* Right Sidebar: Place Details */}
      {selectedPlace && (
        <aside className="fixed top-10 left-110 w-[330px]  bg-white shadow-xl p-6 z-50 rounded-l-2xl overflow-y-auto pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{selectedPlace.name}</h2>
            <button onClick={() => setSelectedPlace(null)}>
              <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
            </button>
          </div>

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
          <div className="mt-4">
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Recensione
            </button>
          </div>
        </aside>
      )}
      {/* Modale recensione */}
      {showReviewModal && (
        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSave={() => setShowReviewModal(false)}
          title={`Recensioni per ${selectedPlace?.name}`}
          actionButtonText="Chiudi"
        >
          <div className="flex justify-center">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </Modal>
      )}
    </>
  );
}
