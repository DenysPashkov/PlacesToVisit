import type { Place, DayName } from "../models/Place";
import { SidebarInfo } from "./SidebarInfo";

export function SidebarCardModalOpeningHours({
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
