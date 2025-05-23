import { useState } from "react";

export default function SideBar() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div style={{ backgroundColor: "white", width: "400px", height: "100%" }}>
        side bar
      </div>
    </>
  );
}
