import {
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Place } from "./Place";
import { Review } from "./Reviews";

/**
 * Manages Firestore operations related to Places.
 *
 * Provides static methods to fetch and add places in the Firestore database.
 */
export class firebaseManager {
  /**
   * Fetches the list of places from the Firestore database and updates the local state.
   *
   * This static method retrieves the document with the specified ID from the "LocationsStoring" collection in Firestore,
   * extracts the "Places" array from the document, constructs `Place` instances from the raw data,
   * and updates the local state using the provided `setPlaces` callback.
   *
   * @param db - The Firestore database instance. Must be initialized.
   * @param setPlaces - A callback function that receives an array of `Place` objects to update the local state.
   *
   * @remarks
   * - If Firestore is not initialized, an error is logged to the console.
   * - The function expects the Firestore document to contain a "Places" array.
   * - Each item in the "Places" array is converted to a `Place` instance using `Place.constructorJson`.
   *
   * @example
   * ```typescript
   * firebaseManager.fetchPlaces(db, setPlaces);
   * ```
   */
  static fetchPlaces(db: Firestore, setPlaces: (place: Place[]) => void) {
    if (db) {
      const docRef = doc(db, "LocationsStoring", "4IZszzf7m4xFrLQrGEcr");
      getDoc(docRef)
        .then((querySnapshot) => {
          const data = querySnapshot.data();
          return data?.Places as any[];
        })
        .then((places) => {
          const constructedPlaces = places.map((place) => {
            return Place.constructorJson(place);
          });
          setPlaces(constructedPlaces);
        });
    } else {
      console.error("Firestore is not initialized.");
    }
  }

  /**
   * Adds a new place to the Firestore database.
   *
   * This function updates the "Places" array in the specified Firestore document
   * by adding the provided `newPlace` object. After successfully updating Firestore,
   * it calls the `setPlaces` callback with the newly added place.
   *
   * @param db - The Firestore database instance.
   * @param newPlace - The `Place` object to be added to the database.
   * @param setPlaces - A callback function to update the local state with the new place.
   */
  static addPlace(
    db: Firestore,
    newPlace: Place,
    setPlaces: (place: Place) => void
  ) {
    const docRef = doc(db, "LocationsStoring", "4IZszzf7m4xFrLQrGEcr");

    updateDoc(docRef, {
      Places: arrayUnion(newPlace.toJSON()),
    })
      .then(() => {
        setPlaces(newPlace);
      })
      .catch((error) => {
        console.error("Error adding place:", error);
      });
  }

  static async updatePlace(
    db: Firestore,
    updatedPlace: Place,
    currentPlaces: Place[],
    setPlaces: (places: Place[]) => void
  ) {
    const docRef = doc(db, "LocationsStoring", "4IZszzf7m4xFrLQrGEcr");

    try {
      const updatedPlaces = currentPlaces.map((place) =>
        place.id === updatedPlace.id ? updatedPlace : place
      );

      const serializedPlaces = updatedPlaces.map((p) => p.toJSON());

      await setDoc(docRef, { Places: serializedPlaces }, { merge: true });

      setPlaces(updatedPlaces); // update state with new list
    } catch (error) {
      console.error("Error updating place:", error);
    }
  }

  static async fetchReviews(
    db: Firestore,
    placeId: string,
    setReviews: (review: Review[]) => void
  ) {
    const reviewRef = collection(
      db,
      "LocationsStoring",
      "4IZszzf7m4xFrLQrGEcr",
      "Places",
      placeId,
      "Reviews"
    );

    try {
      const snapshot = await getDocs(reviewRef);

      const reviews: Review[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        const review = Review.constructorJson(data);
        reviews.push(review);
      });

      setReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  static addReview(
    db: Firestore,
    review: Review,
    setReviews: (review: Review) => void
  ) {
    const reviewRef = doc(
      collection(
        db,
        "LocationsStoring",
        "4IZszzf7m4xFrLQrGEcr",
        "Places",
        review.placeId,
        "Reviews"
      )
    );

    setDoc(reviewRef, review.toJSON())
      .then(() => {
        setReviews(review);
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  }
}
