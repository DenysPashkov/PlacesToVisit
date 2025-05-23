import { useState } from "react";

export default function AddButton() {
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
