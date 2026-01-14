'use server';

import { fetchWithToken } from "..";
import { ApiResponse, RequestDetailResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const getDriverRequestDetail = async (driverId: string): Promise<ApiResponse<RequestDetailResponse>> => {

  try {

    const url = `/admin/drivers/${driverId}`;

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const result = await fetchWithToken<RequestDetailResponse>(url, requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<RequestDetailResponse>("Error al obtener los detalles de la solicitud");
  }

}
