export class Place {
  id: string;
  name: string;
  location: { lat: string; lon: string };
  image: string;
  phoneNumber: string;
  workingHour: string[];

  constructor(
    id: string,
    name: string,
    location: { lat: string; lon: string },
    image: string,
    phoneNumber: string,
    workingHour: string[]
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.image = image;
    this.phoneNumber = phoneNumber;
    this.workingHour = workingHour;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      image: this.image,
      phoneNumber: this.phoneNumber,
      workingHour: this.workingHour,
    };
  }

  static constructorJson(json: any): Place {
    if (!json) {
      throw new Error("Invalid JSON data");
    }

    const id = json.id || "";
    const name = json.name || "";
    const location = {
      lat: json.location?.lat || "",
      lon: json.location?.lon || "",
    };
    const image = json.image || "";
    const phoneNumber = json.phoneNumber || "";
    const workingHour = json.workingHour || [];

    const place = new Place(
      id,
      name,
      location,
      image,
      phoneNumber,
      workingHour
    );
    return place;
  }
}
