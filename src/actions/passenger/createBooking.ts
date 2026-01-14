'use server'

import { ApiResponse } from '@/interfaces';
import { fetchWithToken } from '../fetch-with-token';
import { createErrorResponse } from '../../lib/action-helpers';

export interface CreateBookingRequest {
  routeId: string;
  metodoPago: 'PAYPAL' | 'TARJETA' | 'EFECTIVO';
  pickupLat: number;
  pickupLng: number;
  pickupDireccion: string;
}

export interface BookingResponseData {
  bookingId: string;
  otp: string;
}

export async function createBooking(
  data: CreateBookingRequest
): Promise<ApiResponse<BookingResponseData>> {

  try {
    const result = await fetchWithToken<BookingResponseData>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return result;

  } catch (error) {

    return createErrorResponse<BookingResponseData>('Error al crear la reserva');

  }
}
