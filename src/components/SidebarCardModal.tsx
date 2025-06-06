import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Firestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseManager } from "../models/FirebaseManager";
import type { Place } from "../models/Place";
import { SidebarInfo } from "./SidebarInfo";
import { Review } from "../models/Reviews";
import Modal from "./modal";
import { SidebarCardModalReviews } from "./SidebarCardModalReviews";
import { SidebarCardModalReviewModal } from "./SidebarCardModalReviewModal";
import { SidebarCardModalTags } from "./SidebarCardModalTags";
import { SidebarCardModalOpeningHours } from "./SidebarCardModalOpeningHours";
import { SidebarCardModalLinksReferences } from "./SidebarCardModalLinksReferences";
import { UpdatePlaceDetailInformations } from "./UpdatePlaceDetailInformations";

export function SidebarCardModal({
  setSelectedPlace,
  selectedPlace,
  db,
  places,
  setPlaces,
}: {
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  selectedPlace: Place;
  db: Firestore | null;
  places: Place[];
  setPlaces: (places: Place[]) => void;
}) {
  useEffect(() => {
    findReviews();
  }, []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review | null>(null);
  const [placeToUpdate, setPlaceToUpdate] = useState<Place | null>(null);

  const findReviews = () => {
    if (!db) {
      console.log("Firestore is not initialized.");
      return;
    }
    firebaseManager.fetchReviews(db, selectedPlace.id, (reviews) => {
      setReviews(reviews);
    });
  };

  function generateUUID(): string {
    return crypto.randomUUID();
  }

  function handleSaveReview() {
    if (!db) {
      return;
    }
    if (!newReview) {
      console.error("No review to save");
      return;
    }
    firebaseManager.addReview(db, newReview, (review) => {
      setReviews((prev) => [...prev, review]);
    });
    setNewReview(null);
  }

  function startReviewCreation() {
    const newReview = new Review(
      generateUUID(),
      selectedPlace.id,
      "",
      0,
      0,
      0,
      0,
      ""
    );

    setNewReview(newReview);
  }

  return (
    <aside className="fixed top-10 left-110 w-[330px] bg-white shadow-xl p-6 z-50 rounded-l-2xl overflow-y-auto pointer-events-auto max-h-[70%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{selectedPlace.name}</h2>
        <button onClick={() => setSelectedPlace(null)}>
          <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <SidebarInfo label="Indirizzo">
          {selectedPlace.readableAddress}
        </SidebarInfo>
        <SidebarInfo label="Telefono">
          {selectedPlace.phoneNumber || "Non disponibile"}
        </SidebarInfo>
        <SidebarInfo label="Fascia di prezzo">
          {selectedPlace.priceLevel
            ? "€".repeat(selectedPlace.priceLevel)
            : "Non disponibile"}
        </SidebarInfo>

        <SidebarCardModalLinksReferences selectedPlace={selectedPlace} />

        <SidebarCardModalOpeningHours selectedPlace={selectedPlace} />

        <SidebarCardModalTags selectedPlace={selectedPlace} />

        <SidebarCardModalReviews reviews={reviews} />

        <button
          onClick={() => {
            setPlaceToUpdate(selectedPlace);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Modifica
        </button>

        <button
          onClick={() => {
            startReviewCreation();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Aggiungi
        </button>
      </div>

      {newReview && (
        <Modal
          isOpen={newReview !== null}
          onClose={() => {
            setNewReview(null);
          }}
          onSave={() => {
            handleSaveReview();
          }}
          title="Aggiungi una recensione"
          actionButtonText="Aggiungi"
        >
          <SidebarCardModalReviewModal
            review={newReview}
            setReview={setNewReview}
          ></SidebarCardModalReviewModal>
        </Modal>
      )}

      {placeToUpdate && (
        <Modal
          isOpen={true}
          onClose={() => {
            setPlaceToUpdate(null);
          }}
          onSave={() => {
            // Handle save logic for place update
          }}
          title="Modifica Recensione"
          actionButtonText="Salva"
        >
          <UpdatePlaceDetailInformations
            placeholderPlace={placeToUpdate}
            setPlaces={(updatedPlace) => {
              if (!db) return;
              firebaseManager.updatePlace(
                db,
                updatedPlace,
                places,
                (places) => {
                  setPlaces(places);
                  setPlaceToUpdate(null);
                }
              );
            }}
            setPlaceToModify={setPlaceToUpdate}
          />
        </Modal>
      )}
    </aside>
  );
}
