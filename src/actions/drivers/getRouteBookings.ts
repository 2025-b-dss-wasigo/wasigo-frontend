import { fetchWithToken } from '../fetch-with-token';
import { BookingsRouteResponse } from '@/interfaces/bookings-route.interface';

export async function getRouteBookings(routeId: string) {
  try {
    const response = await fetchWithToken<any>(`/bookings/route/${routeId}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener pasajeros de la ruta');
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function markBookingAsNoShow(bookingId: string) {
  try {
    const response = await fetchWithToken<any>(`/bookings/${bookingId}/no-show`, {
      method: 'PATCH',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al marcar pasajero como no presentado');
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function completeBooking(bookingId: string) {
  try {
    const response = await fetchWithToken<any>(`/bookings/${bookingId}/complete`, {
      method: 'PATCH',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al validar OTP');
    }

    return response;
  } catch (error) {
    throw error;
  }
}
