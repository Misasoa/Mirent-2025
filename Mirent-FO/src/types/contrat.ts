export interface Contract {
    id: number;
    vehicle: string;
    startDate: string;
    endDate: string;
    status: 'actif' | 'terminé' | 'en attente';
    client: string;
}