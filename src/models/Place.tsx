export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WorkingDay {
  start: string; // "19:00"
  end: string; // "00:00"
}

export type OpeningHours = {
  [key in DayName]: WorkingDay[];
};

export class Place {
  // google place id
  id: string;
  // name of the place
  name: string;
  // location of the place where lat and lot are used as follows [lan, lon]
  location: [number, number];
  // the first image of the place, got from google places
  image: string;
  // phone number of the place
  phoneNumber: string;
  // working hour of the place
  workingHour: OpeningHours;

  // address in a human readable way
  readableAddress: string;
  // tags added to this place
  tags: string[];
  // url that are correlated to the place, automatically the google position and the website of the place are added
  urlReferences: string[];
  // price level taken from google places
  priceLevel: number;

  constructor(
    id: string,
    name: string,
    location: [number, number],
    image: string,
    phoneNumber: string,
    workingHour: OpeningHours,
    readableAddress: string,
    tags: string[],
    urlReferences: string[],
    priceLevel: number
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.image = image;
    this.phoneNumber = phoneNumber;

    this.readableAddress = readableAddress;
    this.tags = tags;
    this.urlReferences = urlReferences;
    this.priceLevel = priceLevel;

    this.workingHour = workingHour as OpeningHours;
  }

  // Used to create the structure of teh data before sending it to firebase
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: { lat: "" + this.location[0], lon: this.location[1] },
      image: this.image,
      phoneNumber: this.phoneNumber,
      workingHour: this.workingHour,
      readableAddress: this.readableAddress,
      tags: this.tags,
      urlReferences: this.urlReferences,
      priceLevel: this.priceLevel,
    };
  }

  // This function is used when we're fetchingt the data from firebase
  static constructorJson(json: any): Place {
    if (!json) {
      throw new Error("Invalid JSON data");
    }
    console.log("json: ", json);

    const id = json.id || "";
    const name = json.name || "";
    const location: [number, number] = [json.location?.lat, json.location?.lon];
    const image = json.image || "";
    const phoneNumber = json.phoneNumber || "";
    const workingHour = json.workingHour || [];

    const readableAddress: string = json.readableAddress;
    const tags: string[] = json.tags;
    const urlReferences: string[] = json.urlReferences;
    const priceLevel: number = json.priceLevel;

    const place = new Place(
      id,
      name,
      location,
      image,
      phoneNumber,
      workingHour,
      readableAddress,
      tags,
      urlReferences,
      priceLevel
    );
    return place;
  }
}
