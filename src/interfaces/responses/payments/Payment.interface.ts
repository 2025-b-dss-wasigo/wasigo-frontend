export interface Route {
  publicId: string;
  origen: string;
  fecha: string;
  horaSalida: string;
  destinoBase: string;
  asientosTotales: number;
  asientosDisponibles: number;
  precioPasajero: string;
  estado: string;
  mensaje: string;
}

export interface Booking {
  publicId: string;
  routeId: string;
  route: Route;
  estado: string;
  otpUsado: boolean;
  metodoPago: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface Payment {
  publicId: string;
  bookingId: string;
  booking: Booking;
  amount: string;
  currency: string;
  method: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  reversedAt: string | null;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: {
    data: Payment[];
  };
  timestamp: string;
}
