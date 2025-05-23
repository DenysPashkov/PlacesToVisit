import { useState } from "react";
import SideBar from "./components/sideBar";
import Profile from "./components/profile";
import AddButton from "./components/addButton";
import Map from "./components/map";

function App() {
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
            padding: "2%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <SideBar />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Profile />
            <AddButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
