export type Driver = {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
};

export type Product = 'milho' | 'sorgo';

export type TripStatus = 'Planejada' | 'Em Andamento' | 'Concluída' | 'Cancelada';

export type Trip = {
  id: string;
  oc: string; // Ordem de Carga
  driverId: string;
  product: Product;
  cities: string[];
  estimatedKm: number;
  realKm: number | null;
  sacks: number;
  startDate: string; // Using string for simplicity in mock data
  endDate: string | null;
  status: TripStatus;
  cost?: {
    kmPaid: number;
    referenceValue: number;
  };
};

// For dashboard stats
export type DashboardStats = {
  totalTrips: number;
  tripsInProgress: number;
  totalKmDriven: number;
  totalSacksTransported: number;
};
