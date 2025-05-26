import { useState } from "react";

import SideBar from "./components/sideBar";
import Profile from "./components/profile";
import AddButton from "./components/addButton";
import Map from "./components/map";
import type { Place } from "./models/Place";
import { Firestore } from "firebase/firestore";

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [db, setDB] = useState<Firestore | null>(null);

  return (
    <>
      <div style={{ position: "relative", height: "100%" }}>
        <Map />
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            height: "100%",
            width: "100%",
            padding: "20px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <SideBar
              places={places}
              setPlaces={(places) => {
                setPlaces(places);
              }}
              db={db}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
