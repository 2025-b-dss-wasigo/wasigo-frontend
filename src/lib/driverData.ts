import { Ruta } from '@/data/mockData';
import { Transaccion, EstadisticasConductor } from '@/interfaces';

// Simular delay de 2 segundos
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function obtenerRutasConductor(conductorId: string): Promise<Ruta[]> {
  await delay(2000);

  return [
    {
      id: '1',
      conductorId: conductorId,
      conductorAlias: 'María G.',
      conductorCalificacion: 4.9,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Gris',
        placa: 'ABC-1234'
      },
      lugarSalida: 'Campus Principal',
      destino: 'Escuela Politécnica Nacional',
      fechaViaje: '2024-12-28',
      horaSalida: '07:00',
      asientosDisponibles: 2,
      asientosTotales: 4,
      precio: 1.50,
      estado: 'activa',
      pasajeros: []
    },
    {
      id: '2',
      conductorId: conductorId,
      conductorAlias: 'María G.',
      conductorCalificacion: 4.9,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Gris',
        placa: 'ABC-1234'
      },
      lugarSalida: 'Campus Principal',
      destino: 'EPN - Campus Principal',
      fechaViaje: '2024-12-28',
      horaSalida: '06:30',
      asientosDisponibles: 3,
      asientosTotales: 4,
      precio: 1.75,
      estado: 'activa',
      pasajeros: []
    },
    {
      id: '3',
      conductorId: conductorId,
      conductorAlias: 'María G.',
      conductorCalificacion: 4.9,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Gris',
        placa: 'ABC-1234'
      },
      lugarSalida: 'Sede El Bosque',
      destino: 'Universidad Central',
      fechaViaje: '2024-12-28',
      horaSalida: '18:00',
      asientosDisponibles: 1,
      asientosTotales: 3,
      precio: 2.00,
      estado: 'activa',
      pasajeros: []
    },
    {
      id: '4',
      conductorId: conductorId,
      conductorAlias: 'María G.',
      conductorCalificacion: 4.9,
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Gris',
        placa: 'ABC-1234'
      },
      lugarSalida: 'Campus Principal',
      destino: 'Quito Norte',
      fechaViaje: '2024-12-28',
      horaSalida: '07:30',
      asientosDisponibles: 0,
      asientosTotales: 4,
      precio: 2.50,
      estado: 'en_curso',
      pasajeros: []
    }
  ];
}

export async function obtenerEstadisticasConductor(conductorId: string): Promise<EstadisticasConductor> {
  await delay(2000);

  return {
    totalMes: 127.50,
    totalSemana: 32.00,
    pendiente: 24.50,
    disponible: 103.00,
    viajes: 48,
    cambio: 12.5,
    rutasActivas: 4,
    viajesCompletados: 28,
    calificacion: 4.9
  };
}

export async function obtenerTransaccionesConductor(conductorId: string): Promise<Transaccion[]> {
  await delay(2000);

  return [
    {
      id: '1',
      usuarioId: conductorId,
      tipo: 'ingreso',
      monto: 4.50,
      concepto: 'Viaje EPN → San Rafael',
      fecha: '2024-12-27T08:30:00',
      estado: 'completada',
      metodoPago: 'efectivo'
    },
    {
      id: '2',
      usuarioId: conductorId,
      tipo: 'ingreso',
      monto: 3.00,
      concepto: 'Viaje Conocoto → EPN',
      fecha: '2024-12-26T07:15:00',
      estado: 'completada',
      metodoPago: 'efectivo'
    },
    {
      id: '3',
      usuarioId: conductorId,
      tipo: 'retiro',
      monto: 50.00,
      concepto: 'Retiro a PayPal',
      fecha: '2024-12-25T15:00:00',
      estado: 'completada',
      metodoPago: 'paypal'
    },
    {
      id: '4',
      usuarioId: conductorId,
      tipo: 'ingreso',
      monto: 6.00,
      concepto: 'Viaje Sangolquí → UC',
      fecha: '2024-12-24T18:30:00',
      estado: 'completada',
      metodoPago: 'efectivo'
    },
    {
      id: '5',
      usuarioId: conductorId,
      tipo: 'ingreso',
      monto: 7.50,
      concepto: 'Viaje especial',
      fecha: '2024-12-23T12:00:00',
      estado: 'pendiente',
      metodoPago: 'efectivo'
    }
  ];
}

export async function obtenerRutasActivas(conductorId: string): Promise<Ruta[]> {
  const todasLasRutas = await obtenerRutasConductor(conductorId);
  return todasLasRutas.filter(r => r.estado === 'activa');
}

export async function obtenerRutasPausadas(conductorId: string): Promise<Ruta[]> {
  const todasLasRutas = await obtenerRutasConductor(conductorId);
  return todasLasRutas.filter(r => r.estado === 'en_curso');
}
