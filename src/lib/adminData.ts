import { mockUsuarios, mockTransacciones, mockSolicitudes, SolicitudConductor, Transaccion } from '@/data/mockData';

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
    viajesActivos: 3,
  };
}

export async function obtenerUsuarios() {
  await delay(1500);
  return mockUsuarios;
}

export async function obtenerSolicitudes() {
  await delay(1500);
  return mockSolicitudes;
}

export async function obtenerTransacciones() {
  await delay(1500);
  return mockTransacciones;
}

export async function rechazarSolicitud(id: string) {
  await delay(1000);
  return { success: true, message: `Solicitud ${id} rechazada` };
}

export async function aprobarSolicitud(id: string) {
  await delay(1000);
  return { success: true, message: `Solicitud ${id} aprobada` };
}
