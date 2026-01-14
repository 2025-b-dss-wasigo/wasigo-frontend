export interface RouteMapStop {
  publicId: string;
  lat: string | number;
  lng: string | number;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface RouteMapData {
  stops: RouteMapStop[];
  polyline: string;
}

export interface RouteMapResponse {
  success: boolean;
  message: string;
  data: RouteMapData;
  timestamp: string;
}
