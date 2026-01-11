export interface RouteStop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface Route {
  publicId: string;
  origen: 'EL_BOSQUE' | 'CAMPUS_PRINCIPAL';
  fecha: string; // YYYY-MM-DD
  horaSalida: string; // HH:mm:ss
  destinoBase: string;
  asientosTotales: number;
  asientosDisponibles: number;
  precioPasajero: string;
  estado: string; // ACTIVA, CANCELADA, etc
  mensaje: string;
  stops: RouteStop[];
  createdAt: string;
  updatedAt: string;
}

export interface GetMyRoutesResponse {
  data: Route[];
}
