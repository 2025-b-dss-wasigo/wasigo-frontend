export interface RequestStatusResponse {
  hasApplication: boolean;
  driver?: Driver;
  documents?: Document[];
  vehicles?: any[];
  canUploadDocuments: boolean;
  canReapply: boolean;
}

export interface Document {
  publicId: string;
  tipo: string;
  archivoUrl: string;
  estado: string;
  motivoRechazo: null;
  createdAt: Date;
  updatedAt: Date;
  signedUrl?: string;
}

export interface Driver {
  publicId: string;
  businessUserId: string;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: Date;
  fechaAprobacion: null;
  fechaRechazo: null;
  motivoRechazo: null;
  documents: Document[];
  vehicles: Vehicle[];
  createdAt: Date;
  updatedAt: Date;
}
export interface Vehicle {
  publicId: string,
  marca: string,
  modelo: string,
  color: string,
  placa: string,
  asientosDisponibles: number,
  isActivo: true,
  createdAt: string,
  updatedAt: string
}

