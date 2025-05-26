import { Place } from "./Place";

type LocationData = {
  name: string;
  lat: string;
  lon: string;
};

export class GooglePlacesManager {
  findPlaceId(placeUrl: string): Promise<Place | null> {
    const locationData = this.parseGoogleMapsUrl(placeUrl);
    if (locationData) {
      return this.findPlaceByNameAndLocation(locationData)
        .then((place) => {
          return place;
        })
        .catch((error) => {
          console.error("Error finding place by name and location:", error);
          return null;
        });
    }
    return Promise.resolve(null);
  }

  parseGoogleMapsUrl(url: string): LocationData | null {
    console.log("##", url);
    try {
      const decodedUrl = decodeURIComponent(url);
      // Extract name
      const nameMatch = decodedUrl.match(/\/place\/([^/]+)/);
      const name = nameMatch ? nameMatch[1].replace(/\+/g, " ") : "Unknown";

      // Extract latitude and longitude from !3d<lat>!4d<lon>
      const latLonMatch = decodedUrl.match(/!3d([-.\d]+)!4d([-.\d]+)/);
      if (!latLonMatch) return null;

      const [, lat, lon] = latLonMatch;

      console.log("@@@@ test: ", url, " test2: ", name);

      return { name, lat, lon };
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }

  async findPlaceByNameAndLocation(locationData: LocationData) {
    const query = encodeURIComponent(locationData.name);
    const location = `${locationData.lat},${locationData.lon}`;
    return new Place(
      query + location,
      locationData.name,
      { lat: locationData.lat, lon: locationData.lon },
      "https://placehold.co/100",
      "+39 123 456 7890",
      [
        "Monday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Tuesday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Wednesday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Thursday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Friday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Saturday: 12:30 – 3:00 pm, 6:30 pm – 12:00 am",
        "Sunday: Closed",
      ]
    );
  }
}
