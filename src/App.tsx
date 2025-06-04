import { useEffect, useState } from "react";

import SideBar from "./components/sideBar";
import Profile from "./components/profile";
import AddButton from "./components/addButton";
import Map from "./components/map";
import BottomBar from "./components/bottomBar";
import type { Place } from "./models/Place";
import { Firestore } from "firebase/firestore";

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [db, setDB] = useState<Firestore | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 40.9, lon: 14.3 });

  // Initialize Firebase and Firestore
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    }
  }, []);

  return (
    <>
      <div style={{ position: "relative", height: "100%" }}>
        <Map places={places} myPosition={currentPosition} />
        <div className="absolute top-0 left-0 w-full h-full z-10 gap-5 flex flex-row p-5 justify-between pointer-events-none">
          <div>
            <SideBar
              places={places}
              setPlaces={(places) => {
                setPlaces(places);
              }}
              db={db}
              currentPosition={currentPosition}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Profile setDB={(db) => setDB(db)} />
            <AddButton
              setPlaces={(place) => {
                const placesCopy = [...places];
                placesCopy.push(place);
                setPlaces(placesCopy);
              }}
              db={db}
            />
            
          </div><BottomBar/>
        </div>
      </div>
    </>
  );
}

export default App;
