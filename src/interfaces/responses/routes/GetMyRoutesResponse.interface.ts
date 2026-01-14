import { Route } from "../../routes/AvailableRoute.interface";

export interface RouteStop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface GetMyRoutesResponse {
  data: Route[];
}
