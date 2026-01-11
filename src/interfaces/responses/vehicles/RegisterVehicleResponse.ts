export interface RegisterVehicleResponse {
  vehicle: Vehicle;
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
