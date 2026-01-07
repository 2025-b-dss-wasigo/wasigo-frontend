'use server';

import { ApiResponse, RoleResponse } from "@/interfaces";
import { fetchWithToken } from "../fetch-with-token";
import { createErrorResponse } from "../../lib/action-helpers";

export const getRole = async (): Promise<ApiResponse<RoleResponse>> => {

  try {

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const result = await fetchWithToken<RoleResponse>('/auth/role', requestOptions);
    return result;

  } catch (error) {
    return createErrorResponse<RoleResponse>("Error al obtener el role");
  }


}