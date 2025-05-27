import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

type Props = {
  children: React.ReactNode;
};

export const GoogleApiProvider = ({ children }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "TODO: add to the settings input",
    libraries,
  });

  if (loadError) return <div>Google Maps failed to load.</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return <>{children}</>;
};
