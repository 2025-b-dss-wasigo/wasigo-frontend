'use server';

import { deleteAccessToken, deleteRefreshToken, fetchWithToken } from "..";

export const logout = async (): Promise<{ success: boolean, message: string }> => {

  try {

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow"
    };

    const result = await fetchWithToken('/auth/logout', requestOptions);

    if (result.success) {
      deleteAccessToken();
      deleteRefreshToken();
    }

    return {
      success: result.success,
      message: result.message || 'Error desconocido'
    };

    return {
      success: false,
      message: 'Error al intentar cerrar sesión'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error al intentar cerrar sesión'
    };
  }

}