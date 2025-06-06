import { useState } from "react";
import { Place } from "../models/Place";
import Modal from "./modal";

export function UpdatePlaceDetailInformations({
  placeholderPlace,
  setPlaces,
  setPlaceToModify,
}: {
  placeholderPlace: Place;
  setPlaces: (place: Place) => void;
  setPlaceToModify: (place: Place | null) => void;
}) {
  const [tempPlace, setTempPlace] = useState<Place>(placeholderPlace);

  const handleChange = (field: keyof Place, value: any) => {
    const updated = new Place(
      tempPlace.id,
      tempPlace.name,
      tempPlace.location,
      tempPlace.image,
      tempPlace.phoneNumber,
      tempPlace.workingHour,
      tempPlace.readableAddress,
      [...tempPlace.tags],
      [...tempPlace.urlReferences],
      tempPlace.priceLevel
    );
    (updated as any)[field] = value;
    setTempPlace(updated);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => setPlaceToModify(null)}
      onSave={() => {
        setPlaces(tempPlace);
        setPlaceToModify(null);
      }}
      title="Conferma le informazioni"
      actionButtonText="Salva"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={tempPlace.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Nome"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={tempPlace.readableAddress}
          onChange={(e) => handleChange("readableAddress", e.target.value)}
          placeholder="Indirizzo"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={tempPlace.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          placeholder="Numero di telefono"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={tempPlace.priceLevel}
          onChange={(e) => handleChange("priceLevel", parseInt(e.target.value))}
          placeholder="Prezzo"
          className="w-full p-2 border rounded"
        />
        {/* Tags (comma separated) */}
        <input
          type="text"
          value={tempPlace.tags.join(", ")}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
          placeholder="Tag (separati da virgola)"
          className="w-full p-2 border rounded"
        />
        {/* Coordinates */}
        <div className="flex gap-2">
          <input
            type="number"
            value={tempPlace.location[0]}
            onChange={(e) =>
              handleChange("location", [
                parseFloat(e.target.value),
                tempPlace.location[1],
              ])
            }
            placeholder="Latitudine"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={tempPlace.location[1]}
            onChange={(e) =>
              handleChange("location", [
                tempPlace.location[0],
                parseFloat(e.target.value),
              ])
            }
            placeholder="Longitudine"
            className="w-full p-2 border rounded"
          />
        </div>
        {/* TODO: Add working hours UI */}
        {/* You can create a component that shows editable time inputs for each day */}
      </div>
    </Modal>
  );
}
