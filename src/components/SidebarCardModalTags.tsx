import type { Place } from "../models/Place";
import { SidebarInfo } from "./SidebarInfo";

export function SidebarCardModalTags({
  selectedPlace,
}: {
  selectedPlace: Place;
}) {
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
