import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Place } from "../models/Place";
import { useEffect } from "react";
import L from "leaflet";

export default function Map({
  places,
  myPosition,
}: {
  places: Place[];
  myPosition: [number, number];
}) {
  return (
    <div className="w-full h-full absolute bg-gray-200 z-0">
      <MapContainer
        center={myPosition}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {places.map((place) => (
          <LocationMarker key={place.id} place={place} />
        ))}
        <MyPositionMarker position={myPosition} />
        <RecenterMap position={myPosition} />
      </MapContainer>
    </div>
  );

  function LocationMarker({ place }: { place: Place }) {
    return (
      <Marker position={place.location}>
        <LocationMarkerPopup place={place} />
      </Marker>
    );
  }

  function LocationMarkerPopup({ place }: { place: Place }) {
    return (
      <Popup>
        <div style={{ textAlign: "center" }}>
          <img
            src={place.image}
            alt={place.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "5px",
              marginBottom: "8px",
            }}
          />
          <div>
            <strong>{place.name}</strong>
            <br />
            {place.phoneNumber}
          </div>
        </div>
      </Popup>
    );
  }

  function MyPositionMarker({ position }: { position: [number, number] }) {
    return (
      <Marker
        icon={
          new L.DivIcon({
            className: "",
            html: `<div style="
              width: 16px;
              height: 16px;
              background: #2196f3;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 6px #2196f3;
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })
        }
        key={"" + position[0] + position[1]}
        position={position}
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  // 🔁 Helper component to recenter the map when position changes
  function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }, [position, map]);

    return null;
  }
}
