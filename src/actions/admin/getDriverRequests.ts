'use server';

import { fetchWithToken } from "..";
import { ApiResponse, GetDriverRequestsResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export type RequestStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

export const getDriverRequests = async (status: RequestStatus = 'PENDIENTE'): Promise<ApiResponse<GetDriverRequestsResponse>> => {

  try {

    const url = `/admin/drivers?estado=${status}`

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const result = await fetchWithToken<GetDriverRequestsResponse>(url, requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<GetDriverRequestsResponse>("Error al obtener las solicitudes");
  }

}