import { useEffect, useState } from "react";
import type { Place } from "../models/Place";
import defaultRestaurant from "../assets/restaurant-img-default.png";
export function SidebarCard({
  place,
  setSelectedPlace,
  currentPosition,
}: {
  place: Place;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  currentPosition: [number, number] | null;
}) {
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

  useEffect(() => {
    if (!currentPosition) return;
    const distance = getDistanceFromUser(currentPosition, place.location);
    setDistance(distance);
  }, [currentPosition]);

  const [distance, setDistance] = useState<number | null>(null);
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
