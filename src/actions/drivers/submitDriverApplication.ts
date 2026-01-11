'use server';

import { revalidatePath } from 'next/cache';
import { setPaypalEmail } from './setPaypalEmail';
import { uploadDriverDocument } from './uploadDriverDocument';
import { registerVehicle } from '../vehicles/registerVehicle';

interface DriverApplicationData {
  paypalEmail: string;
  licencia: File;
  matricula: File;
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  asientos: number;
}

interface SubmitDriverApplicationResponse {
  success: boolean;
  message: string;
}

export const submitDriverApplication = async (
  data: DriverApplicationData
): Promise<SubmitDriverApplicationResponse> => {
  try {

    const paypalResponse = await setPaypalEmail(data.paypalEmail);

    if (!paypalResponse.success) {
      return {
        success: false,
        message: paypalResponse.message || 'Error al crear la solicitud',
      };
    }

    const [licenciaResponse, matriculaResponse] = await Promise.all([
      uploadDriverDocument(data.licencia, 'LICENCIA'),
      uploadDriverDocument(data.matricula, 'MATRICULA'),
    ]);

    if (!licenciaResponse.success) {
      return {
        success: false,
        message: licenciaResponse.message || 'Error al crear la solicitud',
      };
    }

    if (!matriculaResponse.success) {
      return {
        success: false,
        message: matriculaResponse.message || 'Error al crear la solicitud',
      };
    }

    // Paso 3: Registrar el vehículo
    const vehicleResponse = await registerVehicle({
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      placa: data.placa,
      asientos: data.asientos,
    });

    if (!vehicleResponse.success) {
      return {
        success: false,
        message: vehicleResponse.message || 'Error al crear la solicitud',
      };
    }

    // Revalidar el path para que se refresque la página
    revalidatePath('/');

    return {
      success: true,
      message: 'Solicitud creada exitosamente',
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error al crear la solicitud',
    };
  }
};
