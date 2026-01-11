export type OrigenCampus = 'CAMPUS_PRINCIPAL' | 'EL_BOSQUE';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface RouteStop {
  lat: number;
  lng: number;
  direccion: string;
}

export interface CreateRouteRequest {
  origen: OrigenCampus;
  fecha: string; // YYYY-MM-DD
  horaSalida: string; // HH:mm
  destinoBase: string;
  asientosTotales: number;
  precioPasajero: number;
  mensaje: string;
  stops: RouteStop[];
}
