'use server';

import { fetchWithToken } from "..";
import { ApiResponse, RequestStatusResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const getRequestStatus = async (): Promise<ApiResponse<RequestStatusResponse>> => {

  try {

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
      cache: 'no-store'
    };

    const result = await fetchWithToken<RequestStatusResponse>("/drivers/me", requestOptions)
    return result;

  } catch (error) {

    return createErrorResponse<RequestStatusResponse>('Error al obtener el estado de la solicitud')

  }

}