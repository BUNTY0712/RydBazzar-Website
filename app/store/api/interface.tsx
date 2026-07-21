export interface IntermediateStop {
  order: number;
  location: string;
  latitude: number;
  longitude: number;
  state: string;
}

export interface FareQuoteRequest {
  phoneNumber: string;
  role: "CUSTOMER" | "DRIVER";
  fromLocation: string;
  fromLatitude: number;
  fromLongitude: number;
  toLocation: string;
  toLatitude: number;
  toLongitude: number;
  pickupDate: string;
  pickupTime: string;
  amOrPm: "AM" | "PM";
  returnDate?: string;
  returnTime?: string;
  returnAmOrPm?: "AM" | "PM";
  intermediateStops?: IntermediateStop[];
  tripType: "ONE_WAY" | "ROUND_TRIP";
}

export interface FareQuoteResponse {
  success: boolean;
  message: string;
  data: any; // Replace with actual response model if available
}