import { Pasajero } from '@/data/mockData';

export interface Ruta {
  id: string;
  conductorId: string;
  conductorAlias: string;
  conductorCalificacion: number;
  conductorFoto?: string;
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
    placa: string;
  };
  lugarSalida: string;
  fechaViaje: string;
  horaSalida: string;
  destino: string;
  asientosDisponibles: number;
  asientosTotales: number;
  precio: number;
  mensajeAdicional?: string;
  estado: 'activa' | 'en_curso' | 'completada' | 'cancelada' | 'pausada';
  pasajeros: Pasajero[];
  diasRecurrentes?: string[];
  fechaCreacion?: string;
}

export interface Transaccion {
  id: string;
  usuarioId: string;
  tipo: 'ingreso' | 'retiro';
  monto: number;
  concepto: string;
  fecha: string;
  estado: 'completada' | 'pendiente' | 'fallida';
  metodoPago?: string;
}

export interface EstadisticasConductor {
  totalMes: number;
  totalSemana: number;
  pendiente: number;
  disponible: number;
  viajes: number;
  cambio: number;
  rutasActivas: number;
  viajesCompletados: number;
  calificacion: number;
}

export interface FormularioRuta {
  origen: string;
  destino: string;
  hora: string;
  diasRecurrentes: string[];
  asientosDisponibles: number;
  precioPorAsiento: number;
  esRecurrente: boolean;
}
