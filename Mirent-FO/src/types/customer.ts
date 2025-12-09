export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  createdAt: string;
  logo: string;
}

export interface Rental {
  id: string;
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "active" | "completed" | "cancelled";
}