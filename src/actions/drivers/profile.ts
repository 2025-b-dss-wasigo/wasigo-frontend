'use server';

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface Document {
  publicId: string;
  tipo: string;
  archivoUrl: string;
  estado: string;
  motivoRechazo: string | null;
  createdAt: string;
  updatedAt: string;
  signedUrl?: string;
}

export interface Vehicle {
  publicId: string;
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  asientosDisponibles: number;
  isActivo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriverProfile {
  publicId: string;
  businessUserId: string;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: string;
  fechaAprobacion: string | null;
  fechaRechazo: string | null;
  motivoRechazo: string | null;
  documents: Document[];
  vehicles: Vehicle[];
  createdAt: string;
  updatedAt: string;
}

export interface DriverMeData {
  hasApplication: boolean;
  driver: DriverProfile;
  documents: Document[];
  vehicles: Vehicle[];
  canUploadDocuments: boolean;
  canReapply: boolean;
}

export interface DriverMeResponse extends ApiResponse<DriverMeData> { }

export async function getDriverProfile(): Promise<DriverMeResponse> {
  try {
    const response = await fetchWithToken<DriverMeData>('/drivers/me');
    return response;
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch driver profile',
      message: 'Error al obtener el perfil del conductor',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}

