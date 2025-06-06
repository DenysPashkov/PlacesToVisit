import { Review } from "../models/Reviews";
import { StarRating } from "./StarRating";

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
