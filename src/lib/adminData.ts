import { mockUsuarios, mockTransacciones, mockSolicitudes, Usuario, Transaccion, Solicitud } from '@/data/mockData';

// Simular delay de 2 segundos
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface EstadisticasAdmin {
  totalUsuarios: number;
  solicitudesPendientes: number;
  ingresosDelMes: number;
  viajesActivos: number;
}

export async function obtenerEstadisticasAdmin(): Promise<EstadisticasAdmin> {
  await delay(2000);

  const solicitudesPendientes = mockSolicitudes.filter(s => s.estado === 'pendiente').length;
  const ingresos = mockTransacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((acc, t) => acc + t.monto, 0);

  return {
    totalUsuarios: mockUsuarios.length,
    solicitudesPendientes,
    ingresosDelMes: ingresos,
    viajesActivos: 12
  };
}

export async function obtenerSolicitudesPendientes(): Promise<Solicitud[]> {
  await delay(2000);
  return mockSolicitudes.filter(s => s.estado === 'pendiente');
}

export async function obtenerTransaccionesRecientes(): Promise<Transaccion[]> {
  await delay(2000);
  return mockTransacciones.slice(0, 5);
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  await delay(2000);
  return mockUsuarios;
}

export async function obtenerTransacciones(): Promise<Transaccion[]> {
  await delay(2000);
  return mockTransacciones;
}

export async function obtenerSolicitudes(): Promise<Solicitud[]> {
  return mockSolicitudes;
}

export type { Usuario, Transaccion, Solicitud };
