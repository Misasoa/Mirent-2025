export interface Contract {
  id: number;
  proforma: string;
  model: string;
  immatriculation: string;
  destination: string;
  jours: number;
  dateDepart: string;
  dateRetour: string;
  prixAchat: number;
  prixVente: number;
  carburant: number;
  totalPrix: number;
  totalNet: number;
  dateVisite: string;
}

export interface Customer {
  id: number;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
  contracts: Contract[];
}
