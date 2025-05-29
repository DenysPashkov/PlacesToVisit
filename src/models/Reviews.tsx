export class Review {
  reviewId: string;
  placeId: string;
  reviewer: string;
  food: number;
  price: number;
  location: number;
  service: number;
  comment: string;

  constructor(
    reviewId: string,
    placeId: string,
    reviewer: string,
    food: number,
    price: number,
    location: number,
    service: number,
    comment: string
  ) {
    this.reviewId = reviewId;
    this.placeId = placeId;
    this.reviewer = reviewer;
    this.food = food;
    this.price = price;
    this.location = location;
    this.service = service;
    this.comment = comment;
  }

  toJSON() {
    return {
      reviewId: this.reviewId,
      placeId: this.placeId,
      reviewer: this.reviewer,
      food: this.food,
      price: this.price,
      location: this.location,
      service: this.service,
      comment: this.comment,
    };
  }
}
