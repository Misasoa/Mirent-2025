export interface Prix {
  id: number;
  prix: number;
}

export interface Region {
  id: number;
  nom_region: string;
  nom_district: string | null;
  prix: Prix;
}