export interface GetDriverRequestsResponse {
  drivers: Driver[];
  total: number;
}

export interface Driver {
  publicId: string;
  businessUserId: string;
  userPublicId: string;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: Date;
  userName: string;
  documentsCount: number;
  pendingDocuments: number;
}