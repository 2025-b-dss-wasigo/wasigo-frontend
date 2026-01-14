export interface ProfileData {
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

export interface UserData {
  publicId: string;
  alias: string;
  isDeleted: boolean;
  deletedAt: string | null;
  profile: ProfileData;
  createdAt: string;
  updatedAt: string;
}

export interface DriverData {
  publicId: string;
  businessUserId: string;
  user: UserData;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: string;
  fechaAprobacion: string;
  fechaRechazo: string | null;
  motivoRechazo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Stop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface RouteData {
  publicId: string;
  driverId: string;
  driver: DriverData;
  origen: string;
  fecha: string;
  horaSalida: string;
  destinoBase: string;
  asientosTotales: number;
  asientosDisponibles: number;
  precioPasajero: string;
  estado: string;
  mensaje: string;
  stops?: Stop[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  publicId: string;
  routeId: string;
  route: RouteData;
  estado: string;
  otpUsado: boolean;
  metodoPago: string;
  otp: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface BookingsListData {
  data: Booking[];
}

export interface BookingDetailData {
  data: Booking;
}
