import { useState } from "react";

export default function Profile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
        }}
      >
        profile
      </div>
    </>
  );
}
