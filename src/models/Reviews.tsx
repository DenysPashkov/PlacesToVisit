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

  // This function is used when we're fetchingt the data from firebase
  static constructorJson(json: any): Review {
    if (!json) {
      throw new Error("Invalid JSON data");
    }

    const reviewId: string = json.reviewId || "";
    const placeId: string = json.placeId || "";
    const reviewer: string = json.reviewer || "";
    const food: number = json.food || 0;
    const price: number = json.price || 0;
    const location: number = json.location || 0;
    const service: number = json.service || 0;
    const comment: string = json.comment || "";

    const review = new Review(
      reviewId,
      placeId,
      reviewer,
      food,
      price,
      location,
      service,
      comment
    );
    return review;
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
