export interface RouteStop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface RouteMapData {
  stops: RouteStop[];
}

export interface RouteMapResponse {
  success: boolean;
  message: string;
  data: RouteMapData;
  timestamp: string;
}
