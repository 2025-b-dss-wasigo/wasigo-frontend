'use server';

import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse, BookingDetailData, Booking } from '@/interfaces';

export async function getBookingDetail(bookingId: string): Promise<ApiResponse<BookingDetailData>> {

  const response = await fetchWithToken<BookingDetailData>(`/bookings/${bookingId}`, { method: 'GET' });

  return response;
}
