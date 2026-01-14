// Esta es la ruta individual
export interface Route {
  publicId: string;
  origen: 'CAMPUS_PRINCIPAL' | 'EL_BOSQUE';
  destinoBase: string;
  fecha: string;
  horaSalida: string;
  asientosDisponibles: number;
  asientosTotales?: number;
  precioPasajero: number;
  mensaje: string;
  distanceKm: number;
  startedAt: string | null;
  estado?: string;
  driver: {
    alias: string;
    rating: number;
  };
  stops: Array<{
    publicId?: string;
    lat: number | string;
    lng: number | string;
    direccion?: string;
    orden?: number;
    createdAt?: string;
  }>;
}