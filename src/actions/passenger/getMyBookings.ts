'use server';

import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse, BookingsListData } from '@/interfaces';

export async function getMyBookings(): Promise<ApiResponse<BookingsListData>> {
  return fetchWithToken('/bookings/my', { method: 'GET' });
}
