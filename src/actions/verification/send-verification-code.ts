'use server';

import { fetchWithToken } from "..";

interface VerificationResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  code?: string;
  timestamp: Date;
}


export async function sendVerificationCode(): Promise<VerificationResponse> {
  try {

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow"
    };

    const result = await fetchWithToken('/verification/send', requestOptions);
    return result as unknown as VerificationResponse;

  } catch (error) {
    return {
      success: false,
      message: 'Error al procesar la solicitud',
      statusCode: 500,
      timestamp: new Date()
    };
  }
}
