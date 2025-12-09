export interface Reservation {
  id: number;
  dateDepart: string; // Ou Date si vous préférez manipuler des objets Date
  dateRetour: string; // Ou Date
  nombreJours: number;
  subTotal: number;
  proformald: number | null;
  vehicleld: number;
  regionld: number;
  prixld: number;
  // Ajoutez ici les types pour les relations si vous les affichez
}
