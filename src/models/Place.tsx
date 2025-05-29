type DayName =
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

// function required for create the OpeningHour from the information received from google
function createOpeningHours(weekday_text: string[]): OpeningHours {
  console.log("Test :", weekday_text);
  const daysMap: Record<string, DayName> = {
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
    Sunday: "sunday",
  };

  const convertTo24Hour = (timeStr: string): string => {
    if (!timeStr || typeof timeStr !== "string") {
      return "00:00";
    }

    // Normalize different unicode spaces to regular space
    const clean = timeStr
      .replace(/[\u2000-\u200F\u202F\u205F\u3000]/g, " ") // all uncommon Unicode space characters
      .trim();

    const parts = clean.split(/(AM|PM)/i);

    if (parts.length < 2) {
      return "00:00";
    }

    const [time, modifier] = parts;
    let [hours, minutes] = time.trim().split(":").map(Number);

    const isPM = modifier.toLowerCase() === "pm";
    const isAM = modifier.toLowerCase() === "am";

    if (isPM && hours !== 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const output = {} as OpeningHours;

  weekday_text.forEach((entry) => {
    const [rawDay, rawTimes] = entry.split(": ");
    const day = daysMap[rawDay];

    if (!day) return;

    if (!rawTimes || rawTimes.toLowerCase() === "closed") {
      output[day] = [];
    } else {
      const ranges = rawTimes.split(",").map((range) => {
        const [startRaw, endRaw] = range.split("–").map((s) => s.trim());
        return {
          start: convertTo24Hour(startRaw),
          end: convertTo24Hour(endRaw),
        };
      });
      output[day] = ranges;
    }
  });

  return output;
}

export class Place {
  id: string;
  name: string;
  location: [number, number];
  image: string;
  phoneNumber: string;
  workingHour: OpeningHours;

  constructor(
    id: string,
    name: string,
    location: [number, number],
    image: string,
    phoneNumber: string,
    workingHour: string[] | OpeningHours
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.image = image;
    this.phoneNumber = phoneNumber;

    // Better check to avoid misinterpretation
    if (Array.isArray(workingHour) && typeof workingHour[0] === "string") {
      console.log("case 1");
      this.workingHour = createOpeningHours(workingHour);
    } else {
      console.log("case 2");
      this.workingHour = workingHour as OpeningHours;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: { lat: "" + this.location[0], lon: this.location[1] },
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
    const location: [number, number] = [json.location?.lat, json.location?.lon];
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
