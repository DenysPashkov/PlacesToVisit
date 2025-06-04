import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Firestore } from "firebase/firestore";
import { useEffect } from "react";
import { firebaseManager } from "../models/FirebaseManager";
import type { Place, DayName } from "../models/Place";
import { SidebarInfo } from "./SidebarInfo";

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

  const findReviews = () => {
    if (!db) {
      console.log("Firestore is not initialized.");
      return;
    }
    firebaseManager.fetchReviews(db, selectedPlace.id, (reviews) => {
      // getting the reviews from the firebase manager
      console.log("Fetched reviews:", reviews);
    });
  };

  return (
    <aside className="fixed top-10 left-110 w-[330px] bg-white shadow-xl p-6 z-50 rounded-l-2xl overflow-y-auto pointer-events-auto">
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
      </div>
    </aside>
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
