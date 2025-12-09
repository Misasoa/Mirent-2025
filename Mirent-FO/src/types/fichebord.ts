// types/logbook.ts

export interface Logbook {
  id?: number;
  vehicleId: number;
  driverId: number;
  departureDate: string;
  returnDate: string;
  startMileage: number;
  endMileage: number;
  startFuelLevel: string;
  endFuelLevel: string;
  notes?: string;
  vehicleCondition: "clean" | "dirty" | "damaged";
}
