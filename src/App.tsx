import { useState } from "react";
import SideBar from './components/sideBar'
import Profile from './components/Profile'
import AddButton from './components/AddButton'


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div style={{ position: "relative", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "red",
          }}
        >
          {" "}
        </div>
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
