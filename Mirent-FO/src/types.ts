export interface Vehicle {
  id: number;
  name: string;
  type: "car" | "motorcycle" | "van";
  price: number;
  image: string;
  seats: number;
  transmission: "manual" | "automatic";
  available: boolean;
}

export interface RentalPeriod {
  startDate: Date;
  endDate: Date;
}
