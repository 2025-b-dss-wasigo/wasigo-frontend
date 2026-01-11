'use server';

import { fetchWithToken } from "..";
import { ApiResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const approveDriverDocument = async (documentId: string): Promise<ApiResponse<null>> => {
  try {
    const url = `/admin/drivers/documents/${documentId}/approve`;

    const requestOptions: RequestInit = {
      method: "PATCH",
      redirect: "follow"
    };

    const result = await fetchWithToken<null>(url, requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<null>("Error al aprobar el documento");
  }
};

export const rejectDriverDocument = async (documentId: string, reason: string): Promise<ApiResponse<null>> => {
  try {
    const url = `/admin/drivers/documents/${documentId}/reject`;

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
    return createErrorResponse<null>("Error al rechazar el documento");
  }
};
