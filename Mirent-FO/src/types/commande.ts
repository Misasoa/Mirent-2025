export interface OrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
  taxes: number;
  amount: number;
}

export interface Order {
  id: string;
  client: string;
  location: string;
  expiration: string;
  priceList: string;
  paymentTerms: string;
  rentalPeriodStart: string;
  rentalPeriodEnd: string;
  duration: number;
  reference: string;
  voiture: string;
  destination: string;
  carburant: number;
  listePrix: string;
  condtionPaiement: string;
  items: OrderItem[];
}
