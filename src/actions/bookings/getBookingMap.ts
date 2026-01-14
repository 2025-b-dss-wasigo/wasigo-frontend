'use server';

import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface BookingMapStop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

export interface BookingMapData {
  stops: BookingMapStop[];
  polyline: string;
}

export async function getBookingMap(bookingId: string): Promise<ApiResponse<BookingMapData>> {

  try {
    const response = await fetchWithToken<BookingMapData>(`/bookings/${bookingId}/map`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    throw error;
  }
}
