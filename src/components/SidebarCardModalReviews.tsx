import type { Review } from "../models/Reviews";
import { SidebarInfo } from "./SidebarInfo";

export function SidebarCardModalReviews({ reviews }: { reviews: Review[] }) {
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
