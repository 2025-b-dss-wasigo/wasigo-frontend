'use server';

import { fetchWithToken } from "..";
import { ApiResponse, RegisterVehicleResponse } from "../../interfaces";
import { createErrorResponse } from "../../lib/action-helpers";

interface RegisterVehicleData {
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  asientos: number;
}

export const registerVehicle = async (data: RegisterVehicleData): Promise<ApiResponse<RegisterVehicleResponse>> => {

  try {

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({
        marca: data.marca,
        modelo: data.modelo,
        color: data.color,
        placa: data.placa,
        asientosDisponibles: data.asientos,
      }),
    };

    const result = await fetchWithToken<RegisterVehicleResponse>("/vehicles", requestOptions);
    return result;

  } catch (error) {

    return createErrorResponse<RegisterVehicleResponse>('Error al registrar el vehículo');

  }

}
