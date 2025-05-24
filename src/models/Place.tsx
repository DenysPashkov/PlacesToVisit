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
}
