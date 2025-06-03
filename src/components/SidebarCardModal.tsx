import type { Firestore } from "firebase/firestore";
import type { DayName, Place } from "../models/Place";
import { useEffect } from "react";
import { firebaseManager } from "../models/FirebaseManager";
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

  const friendlyDomains: Record<string, string> = {
    "maps.google.com": "Google Maps",
    "www.google.com": "Google",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "tripadvisor.it": "TripAdvisor",
    // Add more known domains as needed
  };

  function getDomainLabel(url: string): string {
    try {
      const { hostname } = new URL(url);

      // Check against friendly domain map
      if (hostname in friendlyDomains) {
        return friendlyDomains[hostname];
      }

      // Fallback to clean domain name extraction
      const noWww = hostname.replace(/^www\./, "");
      const domainParts = noWww.split(".");
      return domainParts.length > 2
        ? domainParts[domainParts.length - 2]
        : domainParts[0];
    } catch {
      return url; // fallback to raw URL if parsing fails
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => setSelectedPlace(null)}
      onSave={() => setSelectedPlace(null)}
      title={selectedPlace.name}
      actionButtonText="Chiudi"
    >
      <div className="space-y-4 text-sm text-gray-700">
        <SidebarCardModalCell label="Indirizzo">
          {selectedPlace.readableAddress}
        </SidebarCardModalCell>
        <SidebarCardModalCell label="Telefono">
          {selectedPlace.phoneNumber || "Non disponibile"}
        </SidebarCardModalCell>
        <SidebarCardModalCell label="Price range">
          {selectedPlace.priceLevel
            ? "€".repeat(selectedPlace.priceLevel)
            : "Non disponibile"}
        </SidebarCardModalCell>
        <SidebarCardModalCell label="Tag">
          {selectedPlace.tags && selectedPlace.tags.length > 0 ? (
            <div className="flex flex-col gap-2">
              {selectedPlace.tags
                .reduce<string[][]>((rows, tag, idx) => {
                  if (idx % 5 === 0) rows.push([tag]);
                  else rows[rows.length - 1].push(tag);
                  return rows;
                }, [])
                .map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2">
                    {row.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ))}
            </div>
          ) : (
            <span className="text-gray-500">Non disponibile</span>
          )}
        </SidebarCardModalCell>

        <SidebarCardModalCell label="Url di riferimento">
          <div className="flex flex-col gap-1 align-end">
            {selectedPlace.urlReferences.map((url) => {
              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from closing
                  }}
                >
                  {getDomainLabel(url)}
                </a>
              );
            })}
          </div>
        </SidebarCardModalCell>
        <SidebarCardModalCell label="Orari di apertura">
          {selectedPlace.workingHour ? (
            <SidebarCardModalOpeningHours selectedPlace={selectedPlace} />
          ) : (
            <span className="text-gray-500">Non disponibile</span>
          )}
        </SidebarCardModalCell>
      </div>
    </Modal>
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

  return (
    <>
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
    </>
  );
}

function SidebarCardModalCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold">{label}</span>
      <span>{children}</span>
    </div>
  );
}
