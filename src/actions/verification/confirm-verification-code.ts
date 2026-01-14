'use server';

import { fetchWithToken } from "..";

export interface ConfirmResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  timestamp: Date;
}

export const ConfirmVerificationCode = async (code: string): Promise<ConfirmResponse> => {

  try {

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({ code }),
    };

    const result = await fetchWithToken('/verification/confirm', requestOptions);
    return result as unknown as ConfirmResponse;

  } catch (error) {
    return {
      success: false,
      message: 'Error al procesar la solicitud',
      statusCode: 500,
      timestamp: new Date()
    };
  }

}
