import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleApiProvider } from "./components/GoogleApiProvidedr.tsx";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleApiProvider>
      <App />
    </GoogleApiProvider>
  </StrictMode>
);
