export enum ProformaStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  // Ajoutez les autres statuts de votre enum
}

export interface Proforma {
  id: number;
  proformaNumber: string;
  date: string; // Ou Date
  totalAmount: number;
  clientId: number;
  status: ProformaStatus;
  createdAt: string; // Ou Date
  updatedAt: string; // Ou Date
  contractReference: string;
  notes: string;
}
