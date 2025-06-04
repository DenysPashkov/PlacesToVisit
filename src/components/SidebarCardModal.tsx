import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Firestore } from "firebase/firestore";
import { use, useEffect, useState } from "react";
import { firebaseManager } from "../models/FirebaseManager";
import type { Place, DayName } from "../models/Place";
import { SidebarInfo } from "./SidebarInfo";
import { Review } from "../models/Reviews";
import { StarRating } from "./StarRating";
import Modal from "./modal";

export function SidebarCardModal({
  setSelectedPlace,
  selectedPlace,
  db,
}: {
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  selectedPlace: Place;
  db: Firestore | null;
}) {
  useEffect(() => {
    findReviews();
  }, []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review | null>(null);

  const findReviews = () => {
    if (!db) {
      console.log("Firestore is not initialized.");
      return;
    }
    firebaseManager.fetchReviews(db, selectedPlace.id, (reviews) => {
      // getting the reviews from the firebase manager
      console.log("Fetched reviews:", reviews);
      setReviews(reviews);
    });
  };

  function generateUUID(): string {
    return crypto.randomUUID();
  }

  function handleSaveReview() {
    console.log("Saving review:", newReview);
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
    </aside>
  );
}

function SidebarCardModalReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length <= 0) {
    return <></>;
  }

  return (
    <SidebarInfo label="Recensioni">
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.reviewId}
            className="border p-2 rounded shadow-sm text-sm text-gray-700 bg-gray-50"
          >
            <div className="font-semibold text-gray-800">{review.reviewer}</div>
            <div className="text-xs text-gray-500 italic mb-1">
              "{review.comment}"
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>🍽 Cibo: {review.food}/5</span>
              <span>💰 Prezzo: {review.price}/5</span>
              <span>📍 Posizione: {review.location}/5</span>
              <span>🛎 Servizio: {review.service}/5</span>
            </div>
          </div>
        ))}
      </div>
    </SidebarInfo>
  );
}

function SidebarCardModalTags({ selectedPlace }: { selectedPlace: Place }) {
  if (!selectedPlace.tags || selectedPlace.tags.length === 0) {
    return <></>;
  }

  return (
    <SidebarInfo label="Tag">
      <div className="flex flex-wrap gap-2">
        {selectedPlace.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </SidebarInfo>
  );
}

function SidebarCardModalOpeningHours({
  selectedPlace,
}: {
  selectedPlace: Place;
}) {
  const daysOfWeek: DayName[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  if (
    !selectedPlace.workingHour ||
    Object.keys(selectedPlace.workingHour).length <= 0
  ) {
    return <></>;
  }
  return (
    <SidebarInfo label="Orari di apertura">
      {daysOfWeek.map((day) => {
        const slots = selectedPlace.workingHour[day];

        // If no slots for that day, skip rendering
        if (!slots || slots.length === 0) return null;

        const formattedHours = slots
          .map((slot) => `${slot.start} - ${slot.end}`)
          .join(", ");

        // Capitalize the day name
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

        return (
          <div key={day} className="flex justify-between text-gray-600 text-sm">
            <span>{capitalizedDay}:</span>
            <span>{formattedHours}</span>
          </div>
        );
      })}
    </SidebarInfo>
  );
}

function SidebarCardModalLinksReferences({
  selectedPlace,
}: {
  selectedPlace: Place;
}) {
  function getDomainLabel(url: string): string {
    try {
      const { hostname } = new URL(url);
      const friendlyDomains: Record<string, string> = {
        "maps.google.com": "Google Maps",
        "www.google.com": "Google",
        "facebook.com": "Facebook",
        "instagram.com": "Instagram",
        "tripadvisor.it": "TripAdvisor",
      };
      if (hostname in friendlyDomains) return friendlyDomains[hostname];
      const noWww = hostname.replace(/^www\./, "");
      const parts = noWww.split(".");
      return parts.length > 2 ? parts[parts.length - 2] : parts[0];
    } catch {
      return url;
    }
  }

  if (selectedPlace.urlReferences?.length <= 0) {
    return <></>;
  }

  return (
    <SidebarInfo label="Url di riferimento">
      {
        <div className="flex flex-col gap-1">
          {selectedPlace.urlReferences.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {getDomainLabel(url)}
            </a>
          ))}
        </div>
      }
    </SidebarInfo>
  );
}
export function SidebarCardModalReviewModal({
  review,
  setReview,
}: {
  review: Review;
  setReview: React.Dispatch<React.SetStateAction<Review | null>>;
}) {
  const updateReviewField = <K extends keyof Review>(
    key: K,
    value: Review[K]
  ) => {
    setReview(
      new Review(
        key === "reviewId" ? (value as string) : review.reviewId,
        key === "placeId" ? (value as string) : review.placeId,
        key === "reviewer" ? (value as string) : review.reviewer,
        key === "food" ? (value as number) : review.food,
        key === "price" ? (value as number) : review.price,
        key === "location" ? (value as number) : review.location,
        key === "service" ? (value as number) : review.service,
        key === "comment" ? (value as string) : review.comment
      )
    );
  };

  return (
    <div className="max-w-md p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Review Form</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reviewer
        </label>
        <input
          type="text"
          value={review.reviewer}
          onChange={(e) => updateReviewField("reviewer", e.target.value)}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Food
        </label>
        <StarRating setRating={(val) => updateReviewField("food", val)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <StarRating setRating={(val) => updateReviewField("price", val)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <StarRating setRating={(val) => updateReviewField("location", val)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service
        </label>
        <StarRating setRating={(val) => updateReviewField("service", val)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          value={review.comment}
          onChange={(e) => updateReviewField("comment", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
