import { Place } from "./Place";

type LocationData = {
  name: string;
  lat: string;
  lon: string;
};

export class GooglePlacesManager {
  async findPlaceId(placeUrl: string): Promise<Place | null> {
    const locationData = this.parseGoogleMapsUrl(placeUrl);
    if (!locationData) return null;

    try {
      const placeId = await this.fetchPlaceId(locationData);
      if (!placeId) return null;

      const placeDetails = await this.fetchPlaceDetails(placeId);
      return placeDetails;
    } catch (error) {
      console.error("Error fetching place ID:", error);
      return null;
    }
  }

  fetchPlaceId = async (locationData: LocationData): Promise<string | null> => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request: google.maps.places.FindPlaceFromQueryRequest = {
      query: locationData.name,
      fields: ["place_id", "name"],
      locationBias: new google.maps.Circle({
        center: new google.maps.LatLng(
          parseFloat(locationData.lat),
          parseFloat(locationData.lon)
        ),
        radius: 500, // larger radius to get better results
      }),
    };

    return new Promise((resolve, reject) => {
      service.findPlaceFromQuery(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0
        ) {
          resolve(results[0].place_id || null);
        } else {
          reject(
            new Error(
              `Place not found or API error. Status: ${status}, Results: ${results}`
            )
          );
        }
      });
    });
  };

  fetchPlaceDetails = async (placeId: string): Promise<Place | null> => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        "place_id",
        "name",
        "geometry",
        "formatted_phone_number",
        "photos",
        "opening_hours",
      ],
    };

    return new Promise((resolve, reject) => {
      service.getDetails(request, async (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          try {
            const location = result.geometry?.location;
            const photos = result.photos || [];
            let base64Image = "";

            if (photos.length > 0) {
              const imageUrl = photos[0].getUrl({ maxWidth: 400 });
              base64Image = await this.fetchImageAsBase64(imageUrl);
            }

            const workingHours = result.opening_hours?.weekday_text || [];

            resolve(
              new Place(
                placeId,
                result.name || "Unknown",
                {
                  lat: location?.lat().toString() || "0",
                  lon: location?.lng().toString() || "0",
                },
                base64Image,
                result.formatted_phone_number || "N/A",
                workingHours
              )
            );
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Place details not found or error: ${status}`));
        }
      });
    });
  };

  fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
    try {
      // Call your backend proxy server to fetch & convert the image to base64
      const proxyUrl = `http://localhost:3001/api/fetch-place-image?imageUrl=${encodeURIComponent(
        imageUrl
      )}`;

      return await fetch(proxyUrl).then((res): Promise<string> => {
        if (!res.ok) {
          console.error("Proxy server responded with error:", res.statusText);
          return Promise.resolve("https://placehold.co/400");
        }
        return res.text();
      });
    } catch (error) {
      console.error("Failed to fetch image via backend proxy:", error);
      return Promise.resolve("https://placehold.co/400");
    }
  };

  parseGoogleMapsUrl(url: string): LocationData | null {
    try {
      const decodedUrl = decodeURIComponent(url);

      const nameMatch = decodedUrl.match(/\/place\/([^/]+)/);
      const name = nameMatch ? nameMatch[1].replace(/\+/g, " ") : "Unknown";

      const latLonMatch = decodedUrl.match(/!3d([-.\d]+)!4d([-.\d]+)/);
      if (!latLonMatch) return null;

      const [, lat, lon] = latLonMatch;

      return { name, lat, lon };
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
}
