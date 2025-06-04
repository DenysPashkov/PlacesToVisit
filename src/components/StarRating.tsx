function StarRating({ rating, setRating }: StarRatingProps) {
  const maxStars = 5;

  return (
    <div className="flex space-x-1">
      {[...Array(maxStars)].map((_, i) => {
        const starIndex = i + 1;
        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => setRating(starIndex)}
            className="focus:outline-none"
            aria-label={`Valuta ${starIndex} stelle`}
          >
            <svg
              className={`w-8 h-8 ${
                starIndex <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.037 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export interface StarRatingProps {
  rating: number;
  setRating: (value: number) => void;
}
