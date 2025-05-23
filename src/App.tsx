import { useState } from "react";

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
          <div
            style={{ backgroundColor: "white", width: "400px", height: "100%" }}
          >
            side bar
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
              }}
            >
              profile
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
              }}
            >
              add Button
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
