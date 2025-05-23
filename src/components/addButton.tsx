import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
        <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
            }}
        >
        addButton
        </div>
    </>
  );
}

export default App;