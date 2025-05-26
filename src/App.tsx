import { useState } from "react";

import SideBar from "./components/sideBar";
import Profile from "./components/profile";
import AddButton from "./components/addButton";
import Map from "./components/map";
import type { Place } from "./models/Place";

function App() {
  const [places, setPlaces] = useState<Place[]>([]);

  // useEffect(() => {
  //   console.log("TODO: I should call the API to get the places here");
  // }, []);
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
            <SideBar places={places} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Profile />
            <AddButton
              setPlaces={(place) => {
                const placesCopy = [...places];
                placesCopy.push(place);
                setPlaces(placesCopy);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
