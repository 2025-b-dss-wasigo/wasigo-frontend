export interface PassengerProfile {
  businessUserId: string;
  nombre: string;
  apellido: string;
  celular: string;
  fotoPerfilUrl: string | null;
  ratingPromedio: string;
  totalViajes: number;
  totalCalificaciones: number;
  isBloqueadoPorRating: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PassengerUser {
  publicId: string;
  alias: string;
  isDeleted: boolean;
  deletedAt: string | null;
  profile: PassengerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface RouteBooking {
  publicId: string;
  passengerId: string;
  passenger: PassengerUser;
  estado: string;
  otpUsado: boolean;
  otp: string;
  metodoPago: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface BookingsRouteData {
  data: RouteBooking[];
}

export interface BookingsRouteResponse {
  success: boolean;
  message: string;
  data: BookingsRouteData;
  timestamp: string;
}
