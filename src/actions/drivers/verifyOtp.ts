'use server';

import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse } from '@/interfaces';

interface VerifyOtpResponse {
  message: string;
}

export async function verifyOtp(bookingId: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> {
  const response = await fetchWithToken<VerifyOtpResponse>(
    `/bookings/${bookingId}/verify-otp`,
    {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }
  );

  return response;
}
