import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Place, type DayName } from "../models/Place";
import { doc, getDoc, type Firestore } from "firebase/firestore";
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
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [query, setQuery] = useState("");
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);

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
      g
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
        />
      )}
    </>
  );
}

function useGetDistanceFromUser(
  currentPosition: [number, number] | null,
  placePosition: [number, number]
): number | null {
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
  const getDistanceFromUser = (
    myPosition: [number, number],
    destination: [number, number]
  ): number => {
    const lat = destination[0];
    const lon = destination[1];
    const destinationNumber = { lat: lat, lon: lon };

    const lat1 = myPosition[0];
    const lon1 = myPosition[1];
    const myPositionNumber = { lat: lat1, lon: lon1 };
    return haversineDistance(myPositionNumber, destinationNumber);
  };

  if (!currentPosition) return null;

  return getDistanceFromUser(currentPosition, placePosition);
}

function SidebarCard({
  place,
  setSelectedPlace,
  currentPosition,
}: {
  place: Place;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  currentPosition: [number, number] | null;
}) {
  const [distance, setDistance] = useState<number | null>(null);
  useEffect(() => {
    if (!currentPosition) return;
    const distance = useGetDistanceFromUser(currentPosition, place.location);
    setDistance(distance);
  }, [currentPosition]);

  return (
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
          {distance !== null ? `${distance.toFixed(2)} km` : "Calcolo..."}
        </p>
      </div>
    </div>
  );
}

function SidebarCardModal({
  setSelectedPlace,
  selectedPlace,
  db,
}: {
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  selectedPlace: Place;
  db: Firestore | null;
}) {
  const daysOfWeek: DayName[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    findReviews();
  }, []);

  const findReviews = () => {
    if (!db) {
      console.log("Firestore is not initialized.");
      return;
    }
    firebaseManager.fetchReviews(db, selectedPlace.id, (reviews) => {
      // getting the reviews from the firebase manager
      console.log("Fetched reviews:", reviews);
    });
  };

  function getDomainLabel(url: string): string {
    try {
      const { hostname } = new URL(url);
      const friendlyDomains: Record<string, string> = {
        "maps.google.com": "Google Maps",
        "www.google.com": "Google",
        "facebook.com": "Facebook",
        "instagram.com": "Instagram",
        "tripadvisor.it": "TripAdvisor",
      };
      if (hostname in friendlyDomains) return friendlyDomains[hostname];
      const noWww = hostname.replace(/^www\./, "");
      const parts = noWww.split(".");
      return parts.length > 2 ? parts[parts.length - 2] : parts[0];
    } catch {
      return url;
    }
  }

  return (
    <aside className="fixed top-10 left-110 w-[330px] bg-white shadow-xl p-6 z-50 rounded-l-2xl overflow-y-auto pointer-events-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{selectedPlace.name}</h2>
        <button onClick={() => setSelectedPlace(null)}>
          <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <SidebarInfo label="Indirizzo">
          {selectedPlace.readableAddress}
        </SidebarInfo>
        <SidebarInfo label="Telefono">
          {selectedPlace.phoneNumber || "Non disponibile"}
        </SidebarInfo>
        <SidebarInfo label="Fascia di prezzo">
          {selectedPlace.priceLevel
            ? "€".repeat(selectedPlace.priceLevel)
            : "Non disponibile"}
        </SidebarInfo>

        <SidebarInfo label="Tag">
          {selectedPlace.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedPlace.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            "Non disponibile"
          )}
        </SidebarInfo>

        <SidebarInfo label="Url di riferimento">
          {selectedPlace.urlReferences?.length > 0 ? (
            <div className="flex flex-col gap-1">
              {selectedPlace.urlReferences.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {getDomainLabel(url)}
                </a>
              ))}
            </div>
          ) : (
            "Non disponibile"
          )}
        </SidebarInfo>

        <SidebarInfo label="Orari di apertura">
          {selectedPlace.workingHour &&
          Object.keys(selectedPlace.workingHour).length > 0 ? (
            daysOfWeek.map((day) => {
              const slots = selectedPlace.workingHour[day];

              // If no slots for that day, skip rendering
              if (!slots || slots.length === 0) return null;

              const formattedHours = slots
                .map((slot) => `${slot.start} - ${slot.end}`)
                .join(", ");

              // Capitalize the day name
              const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

              return (
                <div
                  key={day}
                  className="flex justify-between text-gray-600 text-sm"
                >
                  <span>{capitalizedDay}:</span>
                  <span>{formattedHours}</span>
                </div>
              );
            })
          ) : (
            <span className="text-gray-500">Non disponibile</span>
          )}
        </SidebarInfo>
      </div>
    </aside>
  );
}

function SidebarInfo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border-b pb-2">
      <span className="font-semibold">{label}</span>
      <span className="text-gray-600">{children}</span>
    </div>
  );
}
