'use server';

import { fetchWithToken } from "..";
import { ApiResponse, GetProfileResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

export const getProfile = async (): Promise<ApiResponse<GetProfileResponse>> => {

  try {

    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const result = await fetchWithToken<GetProfileResponse>("/business/profile", requestOptions)
    return result;

  } catch (error) {

    return createErrorResponse<GetProfileResponse>('Error al obtener la información del perfil');

  }

}
