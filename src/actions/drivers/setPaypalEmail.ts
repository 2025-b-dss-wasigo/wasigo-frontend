'use server';

import { fetchWithToken } from "..";
import { ApiResponse, SetPaypalEmailResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const setPaypalEmail = async (paypalEmail: string): Promise<ApiResponse<SetPaypalEmailResponse>> => {

  try {

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({ paypalEmail }),
    };

    const result = await fetchWithToken<SetPaypalEmailResponse>("/drivers/apply", requestOptions);
    return result;

  } catch (error) {

    return createErrorResponse<SetPaypalEmailResponse>('Error al crear la solicitud');

  }

}