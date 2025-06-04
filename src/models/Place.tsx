export class Place {
  id: string;
  name: string;
  location: { lat: string; lon: string };
  image: string;
  phoneNumber: string;
  workingHour: string[];
  readableAddress: string;
  priceLevel: number;
  tags: string[];
  urlReferences: string[];

  constructor(
    id: string,
    name: string,
    location: { lat: string; lon: string },
    image: string,
    phoneNumber: string,
    workingHour: string[],
    readableAddress: string,
    priceLevel: number,
    tags: string[],
    urlReferences: string[]
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.image = image;
    this.phoneNumber = phoneNumber;
    this.workingHour = workingHour;
    this.readableAddress = readableAddress;
    this.priceLevel = priceLevel;
    this.tags = tags;
    this.urlReferences = urlReferences;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      image: this.image,
      phoneNumber: this.phoneNumber,
      workingHour: this.workingHour,
      readableAddress: this.readableAddress,
      priceLevel: this.priceLevel,
      tags: this.tags,
      urlReferences: this.urlReferences,
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
    const readableAddress = json.readableAddress || "";
    const priceLevel = json.priceLevel ?? 0;
    const tags = json.tags || [];
    const urlReferences = json.urlReferences || [];

    return new Place(
      id,
      name,
      location,
      image,
      phoneNumber,
      workingHour,
      readableAddress,
      priceLevel,
      tags,
      urlReferences
    );
  }
}

