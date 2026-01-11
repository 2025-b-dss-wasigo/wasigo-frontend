'use server';

import { fetchWithToken } from "..";
import { ApiResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const approveDriverRequest = async (driverId: string): Promise<ApiResponse<null>> => {
  try {
    const url = `/admin/drivers/${driverId}/approve`;

    const requestOptions: RequestInit = {
      method: "PATCH",
      redirect: "follow"
    };

    const result = await fetchWithToken<null>(url, requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<null>("Error al aprobar la solicitud de conductor");
  }
};

export const rejectDriverRequest = async (driverId: string, reason: string): Promise<ApiResponse<null>> => {
  try {
    const url = `/admin/drivers/${driverId}/reject`;

    const requestOptions: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ motivoRechazo: reason }),
      redirect: "follow"
    };

    const result = await fetchWithToken<null>(url, requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<null>("Error al rechazar la solicitud de conductor");
  }
};
