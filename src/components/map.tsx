import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Place } from "../models/Place";
import L from "leaflet";

export default function Map({
  places,
  myPosition,
}: {
  places: Place[];
  myPosition: { lat: number; lon: number } | null;
}) {
  // utility function that convert coordinates from object to tuple
  // this is used to convert the coordinates from the Place model to the format that Leaflet expects
  function getPositionFromCoordinates(coordinate: {
    lat: number | string;
    lon: number | string;
  }): [number, number] {
    if (typeof coordinate.lat === "string") {
      coordinate.lat = parseFloat(coordinate.lat);
    }
    if (typeof coordinate.lon === "string") {
      coordinate.lon = parseFloat(coordinate.lon);
    }
    return [coordinate.lat, coordinate.lon];
  }

  // in case of unknow position, there must be a placeholder, to implement
  return myPosition === null ? (
    <>loading...</>
  ) : (
    <div className="w-full h-full absolute bg-gray-200 z-0">
      <MapContainer
        center={getPositionFromCoordinates(myPosition)}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {places.map((place) => {
          return <LocationMarker key={place.id} place={place} />;
        })}
        <MyPositionMarker position={getPositionFromCoordinates(myPosition)} />
      </MapContainer>
    </div>
  );

  // LocationMarker component to display each place on the map
  function LocationMarker({ place }: { place: Place }) {
    return (
      <Marker position={getPositionFromCoordinates(place.location)}>
        <LocationMarkerPopup place={place} />
      </Marker>
    );
  }

  // LocationMarkerPopup component to display the popup for each place
  // TODO: This component must be improved, this version is just a placeholder
  function LocationMarkerPopup({ place }: { place: Place }) {
    return (
      <Popup>
        <div style={{ textAlign: "center" }}>
          <img
            src={place.image}
            alt={place.name}
            style={{
              width: "100PX",
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

  // MyPositionMarker component to display the user's current position
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
}
