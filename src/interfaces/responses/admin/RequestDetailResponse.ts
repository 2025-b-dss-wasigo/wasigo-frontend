export interface RequestDetailResponse {
  driver: Driver;
  documentsWithUrls: DocumentWithUrl[];
}

export interface Driver {
  publicId: string;
  businessUserId: string;
  user: User;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: Date;
  fechaAprobacion: Date | null;
  fechaRechazo: Date | null;
  motivoRechazo: string | null;
  documents: Document[];
  vehicles: Vehicle[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  publicId: string;
  alias: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  businessUserId: string;
  nombre: string;
  apellido: string;
  celular: string;
  fotoPerfilUrl: string | null;
  ratingPromedio: string;
  totalViajes: number;
  totalCalificaciones: number;
  isBloqueadoPorRating: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  publicId: string;
  tipo: string;
  archivoUrl: string;
  estado: string;
  motivoRechazo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentWithUrl extends Document {
  signedUrl: string;
}

export interface Vehicle {
  publicId: string;
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  asientosDisponibles: number;
  isActivo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
