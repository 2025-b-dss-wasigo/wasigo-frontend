// Mock data for WasiGo university carpooling app

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
  lugarSalida: 'Campus Principal' | 'Sede El Bosque';
  fechaViaje: string;
  horaSalida: string;
  destino: string;
  asientosDisponibles: number;
  asientosTotales: number;
  precio: number;
  mensajeAdicional?: string;
  estado: 'activa' | 'en_curso' | 'completada' | 'cancelada';
  pasajeros: Pasajero[];
}

export interface Pasajero {
  id: string;
  alias: string;
  calificacion: number;
  foto?: string;
  destino: string;
  metodoPago: 'efectivo' | 'paypal' | 'tarjeta';
  otp?: string;
  otpValidado: boolean;
  estado: 'confirmado' | 'pendiente' | 'cancelado' | 'no_show';
}

export interface Viaje {
  id: string;
  rutaId: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  conductor: string;
  conductorCalificacion: number;
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  otp: string;
  precio: number;
  metodoPago: 'efectivo' | 'paypal' | 'tarjeta';
}

export interface Ticket {
  id: string;
  tipo: 'incidente' | 'pago' | 'baneo';
  reportadoPor: string;
  usuariosInvolucrados: string[];
  motivo: string;
  descripcion: string;
  fechaCreacion: string;
  estado: 'abierto' | 'en_revision' | 'resuelto' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta';
  rutaId?: string;
}

export interface SolicitudConductor {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  vehiculo: {
    marca: string;
    modelo: string;
    color: string;
    placa: string;
    asientos: number;
  };
  paypalAccount: string;
  licenciaUrl: string;
  matriculaUrl: string;
}

export interface Mensaje {
  id: string;
  chatId: string;
  autor: string;
  autorAlias: string;
  contenido: string;
  timestamp: string;
  esAutor: boolean;
}

export interface Chat {
  id: string;
  rutaId: string;
  titulo: string;
  ultimoMensaje: string;
  horaUltimoMensaje: string;
  noLeidos: number;
  participantes: number;
}

export interface Transaccion {
  id: string;
  fecha: string;
  tipo: 'ingreso' | 'egreso' | 'reversion';
  monto: number;
  concepto: string;
  usuario: string;
  estado: 'completada' | 'pendiente' | 'fallida';
}

// Mock Routes
export const mockRutas: Ruta[] = [
  {
    id: 'r1',
    conductorId: '2',
    conductorAlias: 'Conductor5432',
    conductorCalificacion: 4.9,
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      placa: 'PBC1234',
    },
    lugarSalida: 'Campus Principal',
    fechaViaje: '2025-01-15',
    horaSalida: '17:30',
    destino: 'Sector La Carolina',
    asientosDisponibles: 2,
    asientosTotales: 4,
    precio: 2.50,
    mensajeAdicional: 'Salgo puntual, paso por la Av. Amazonas',
    estado: 'activa',
    pasajeros: [
      { id: 'p1', alias: 'Pasajero8821', calificacion: 4.7, destino: 'Av. Amazonas', metodoPago: 'paypal', otp: '482195', otpValidado: false, estado: 'confirmado' },
      { id: 'p2', alias: 'Pasajero4455', calificacion: 4.5, destino: 'La Carolina', metodoPago: 'efectivo', otp: '731284', otpValidado: false, estado: 'confirmado' },
    ]
  },
  {
    id: 'r2',
    conductorId: '5',
    conductorAlias: 'Conductor7821',
    conductorCalificacion: 4.6,
    vehiculo: {
      marca: 'Chevrolet',
      modelo: 'Aveo',
      color: 'Gris',
      placa: 'ABC5678',
    },
    lugarSalida: 'Campus Principal',
    fechaViaje: '2025-01-15',
    horaSalida: '18:00',
    destino: 'Sector Iñaquito',
    asientosDisponibles: 3,
    asientosTotales: 4,
    precio: 2.00,
    estado: 'activa',
    pasajeros: [
      { id: 'p3', alias: 'Pasajero9102', calificacion: 4.8, destino: 'CCI', metodoPago: 'tarjeta', otp: '295847', otpValidado: false, estado: 'confirmado' },
    ]
  },
  {
    id: 'r3',
    conductorId: '6',
    conductorAlias: 'Conductor3344',
    conductorCalificacion: 4.4,
    vehiculo: {
      marca: 'Kia',
      modelo: 'Rio',
      color: 'Rojo',
      placa: 'XYZ9012',
    },
    lugarSalida: 'Sede El Bosque',
    fechaViaje: '2025-01-15',
    horaSalida: '19:00',
    destino: 'Sector Norte (Carcelén)',
    asientosDisponibles: 4,
    asientosTotales: 4,
    precio: 3.00,
    mensajeAdicional: 'Tengo espacio para maletas pequeñas',
    estado: 'activa',
    pasajeros: []
  },
  {
    id: 'r4',
    conductorId: '2',
    conductorAlias: 'Conductor5432',
    conductorCalificacion: 4.9,
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      placa: 'PBC1234',
    },
    lugarSalida: 'Campus Principal',
    fechaViaje: '2025-01-16',
    horaSalida: '07:30',
    destino: 'Sector Sur (El Recreo)',
    asientosDisponibles: 4,
    asientosTotales: 4,
    precio: 2.75,
    estado: 'activa',
    pasajeros: []
  },
];

// Mock Viajes (passenger's trips)
export const mockViajes: Viaje[] = [
  {
    id: 'v1',
    rutaId: 'r1',
    fecha: '2025-01-15',
    hora: '17:30',
    origen: 'Campus Principal',
    destino: 'Av. Amazonas',
    conductor: 'María González',
    conductorCalificacion: 4.9,
    estado: 'programado',
    otp: '482195',
    precio: 2.50,
    metodoPago: 'paypal',
  },
  {
    id: 'v2',
    rutaId: 'r-old1',
    fecha: '2025-01-10',
    hora: '18:00',
    origen: 'Campus Principal',
    destino: 'La Mariscal',
    conductor: 'Pedro Álvarez',
    conductorCalificacion: 4.7,
    estado: 'completado',
    otp: '123456',
    precio: 2.00,
    metodoPago: 'efectivo',
  },
  {
    id: 'v3',
    rutaId: 'r-old2',
    fecha: '2025-01-08',
    hora: '17:00',
    origen: 'Sede El Bosque',
    destino: 'Cotocollao',
    conductor: 'Laura Suárez',
    conductorCalificacion: 4.5,
    estado: 'completado',
    otp: '654321',
    precio: 3.00,
    metodoPago: 'tarjeta',
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: 't1',
    tipo: 'incidente',
    reportadoPor: 'Pasajero8821',
    usuariosInvolucrados: ['Conductor5432', 'Pasajero8821'],
    motivo: 'Conducta inapropiada',
    descripcion: 'El conductor hizo comentarios inapropiados durante el viaje',
    fechaCreacion: '2025-01-14',
    estado: 'abierto',
    prioridad: 'alta',
    rutaId: 'r-old1',
  },
  {
    id: 't2',
    tipo: 'pago',
    reportadoPor: 'Conductor7821',
    usuariosInvolucrados: ['Pasajero4455', 'Conductor7821'],
    motivo: 'Pago en efectivo no realizado',
    descripcion: 'El pasajero no pagó el viaje alegando que no tenía cambio',
    fechaCreacion: '2025-01-13',
    estado: 'en_revision',
    prioridad: 'media',
    rutaId: 'r-old2',
  },
  {
    id: 't3',
    tipo: 'incidente',
    reportadoPor: 'Pasajero9102',
    usuariosInvolucrados: ['Pasajero3344', 'Pasajero9102'],
    motivo: 'Comportamiento molesto',
    descripcion: 'El pasajero estuvo hablando por teléfono en voz alta durante todo el trayecto',
    fechaCreacion: '2025-01-12',
    estado: 'resuelto',
    prioridad: 'baja',
    rutaId: 'r-old3',
  },
  {
    id: 't4',
    tipo: 'baneo',
    reportadoPor: 'Sistema',
    usuariosInvolucrados: ['Pasajero1111'],
    motivo: 'Múltiples reportes',
    descripcion: 'Usuario recibió 3 reportes en los últimos 30 días. Baneo automático aplicado.',
    fechaCreacion: '2025-01-11',
    estado: 'abierto',
    prioridad: 'alta',
  },
];

// Mock Solicitudes de Conductor
export const mockSolicitudes: SolicitudConductor[] = [
  {
    id: 's1',
    usuarioId: 'u10',
    nombre: 'Fernando',
    apellido: 'Castillo',
    email: 'fernando.c@epn.edu.ec',
    fechaSolicitud: '2025-01-14',
    estado: 'pendiente',
    vehiculo: {
      marca: 'Hyundai',
      modelo: 'Accent',
      color: 'Negro',
      placa: 'HYD4567',
      asientos: 4,
    },
    paypalAccount: 'fernando.c@paypal.com',
    licenciaUrl: '/docs/licencia_fc.pdf',
    matriculaUrl: '/docs/matricula_fc.pdf',
  },
  {
    id: 's2',
    usuarioId: 'u11',
    nombre: 'Carla',
    apellido: 'Vinueza',
    email: 'carla.v@epn.edu.ec',
    fechaSolicitud: '2025-01-13',
    estado: 'pendiente',
    vehiculo: {
      marca: 'Nissan',
      modelo: 'Sentra',
      color: 'Azul',
      placa: 'NSN8901',
      asientos: 4,
    },
    paypalAccount: 'carla.v@paypal.com',
    licenciaUrl: '/docs/licencia_cv.pdf',
    matriculaUrl: '/docs/matricula_cv.pdf',
  },
  {
    id: 's3',
    usuarioId: 'u12',
    nombre: 'Diego',
    apellido: 'Mora',
    email: 'diego.m@epn.edu.ec',
    fechaSolicitud: '2025-01-10',
    estado: 'aprobada',
    vehiculo: {
      marca: 'Mazda',
      modelo: '3',
      color: 'Gris',
      placa: 'MAZ2345',
      asientos: 4,
    },
    paypalAccount: 'diego.m@paypal.com',
    licenciaUrl: '/docs/licencia_dm.pdf',
    matriculaUrl: '/docs/matricula_dm.pdf',
  },
];

// User's own driver application status (for different user states)
export interface UserDriverApplication {
  id: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: string;
  motivoRechazo?: string;
  vehiculo: {
    marca: string;
    modelo: string;
    placa: string;
  };
}

// Mock applications for different user states
export const mockUserApplications: Record<string, UserDriverApplication | null> = {
  // User with pending application
  'pending-user': {
    id: 'app-1',
    estado: 'pendiente',
    fechaSolicitud: '2025-01-12',
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Yaris',
      placa: 'TYT1234',
    },
  },
  // User with rejected application
  'rejected-user': {
    id: 'app-2',
    estado: 'rechazada',
    fechaSolicitud: '2025-01-05',
    motivoRechazo: 'Los documentos proporcionados no son legibles. Por favor, sube imágenes más claras de tu licencia de conducir y matrícula del vehículo.',
    vehiculo: {
      marca: 'Chevrolet',
      modelo: 'Sail',
      placa: 'CHV5678',
    },
  },
  // User with no application
  'new-user': null,
};

// Extended Viaje with passengers for driver view
export interface ViajeConPasajeros {
  id: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  precio: number;
  pasajeros: Array<{
    id: string;
    nombre: string;
    alias: string;
    foto?: string;
    calificacion: number;
    destino: string;
    metodoPago: 'efectivo' | 'paypal' | 'tarjeta';
  }>;
}

// Mock driver's trip history
export const mockViajesConductor: ViajeConPasajeros[] = [
  {
    id: 'vc1',
    fecha: '2025-01-14',
    hora: '17:30',
    origen: 'Campus Principal',
    destino: 'La Carolina',
    estado: 'completado',
    precio: 2.50,
    pasajeros: [
      { id: 'p1', nombre: 'Jorge Ramírez', alias: 'Pasajero8821', calificacion: 4.7, destino: 'Av. Amazonas', metodoPago: 'paypal' },
      { id: 'p2', nombre: 'Sofía Torres', alias: 'Pasajero4455', calificacion: 4.5, destino: 'La Carolina', metodoPago: 'efectivo' },
      { id: 'p3', nombre: 'Gabriela Mora', alias: 'Pasajero9102', calificacion: 4.8, destino: 'CCI', metodoPago: 'tarjeta' },
    ],
  },
  {
    id: 'vc2',
    fecha: '2025-01-13',
    hora: '18:00',
    origen: 'Campus Principal',
    destino: 'Iñaquito',
    estado: 'completado',
    precio: 2.00,
    pasajeros: [
      { id: 'p4', nombre: 'Ricardo Vega', alias: 'Pasajero3301', calificacion: 4.6, destino: 'Parque La Carolina', metodoPago: 'paypal' },
      { id: 'p5', nombre: 'Daniela Herrera', alias: 'Pasajero7712', calificacion: 4.9, destino: 'CCI', metodoPago: 'efectivo' },
    ],
  },
  {
    id: 'vc3',
    fecha: '2025-01-15',
    hora: '07:30',
    origen: 'La Mariscal',
    destino: 'Campus Principal',
    estado: 'programado',
    precio: 2.50,
    pasajeros: [
      { id: 'p6', nombre: 'Miguel Andrade', alias: 'Pasajero2244', calificacion: 4.4, destino: 'Campus Principal', metodoPago: 'tarjeta' },
    ],
  },
  {
    id: 'vc4',
    fecha: '2025-01-10',
    hora: '17:00',
    origen: 'Sede El Bosque',
    destino: 'Cotocollao',
    estado: 'completado',
    precio: 3.00,
    pasajeros: [
      { id: 'p7', nombre: 'Andrea Salazar', alias: 'Pasajero5511', calificacion: 4.3, destino: 'Cotocollao', metodoPago: 'efectivo' },
      { id: 'p8', nombre: 'Pablo Núñez', alias: 'Pasajero6622', calificacion: 4.7, destino: 'Carcelén', metodoPago: 'paypal' },
      { id: 'p9', nombre: 'Fernanda Rivas', alias: 'Pasajero7733', calificacion: 4.5, destino: 'Calderón', metodoPago: 'tarjeta' },
      { id: 'p10', nombre: 'Luis Carrillo', alias: 'Pasajero8844', calificacion: 4.8, destino: 'Cotocollao', metodoPago: 'efectivo' },
    ],
  },
];

// Extended passenger viajes with trip participants
export interface ViajeConParticipantes {
  id: string;
  rutaId: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  conductor: {
    id: string;
    nombre: string;
    alias: string;
    foto?: string;
    calificacion: number;
  };
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  otp: string;
  precio: number;
  metodoPago: 'efectivo' | 'paypal' | 'tarjeta';
  otroPasajeros: Array<{
    id: string;
    nombre: string;
    alias: string;
    foto?: string;
  }>;
}

export const mockViajesConParticipantes: ViajeConParticipantes[] = [
  {
    id: 'v1',
    rutaId: 'r1',
    fecha: '2025-01-15',
    hora: '17:30',
    origen: 'Campus Principal',
    destino: 'Av. Amazonas',
    conductor: { id: 'c1', nombre: 'María González', alias: 'Conductor5432', calificacion: 4.9 },
    estado: 'programado',
    otp: '482195',
    precio: 2.50,
    metodoPago: 'paypal',
    otroPasajeros: [
      { id: 'op1', nombre: 'Sofía Torres', alias: 'Pasajero4455' },
      { id: 'op2', nombre: 'Gabriela Mora', alias: 'Pasajero9102' },
    ],
  },
  {
    id: 'v2',
    rutaId: 'r-old1',
    fecha: '2025-01-10',
    hora: '18:00',
    origen: 'Campus Principal',
    destino: 'La Mariscal',
    conductor: { id: 'c2', nombre: 'Pedro Álvarez', alias: 'Conductor7821', calificacion: 4.7 },
    estado: 'completado',
    otp: '123456',
    precio: 2.00,
    metodoPago: 'efectivo',
    otroPasajeros: [
      { id: 'op3', nombre: 'Ricardo Vega', alias: 'Pasajero3301' },
    ],
  },
  {
    id: 'v3',
    rutaId: 'r-old2',
    fecha: '2025-01-08',
    hora: '17:00',
    origen: 'Sede El Bosque',
    destino: 'Cotocollao',
    conductor: { id: 'c3', nombre: 'Laura Suárez', alias: 'Conductor3344', calificacion: 4.5 },
    estado: 'completado',
    otp: '654321',
    precio: 3.00,
    metodoPago: 'tarjeta',
    otroPasajeros: [],
  },
];

// Mock Chats
export const mockChats: Chat[] = [
  {
    id: 'c1',
    rutaId: 'r1',
    titulo: 'Ruta Campus → La Carolina (17:30)',
    ultimoMensaje: 'Perfecto, los espero en la entrada principal',
    horaUltimoMensaje: '14:35',
    noLeidos: 2,
    participantes: 3,
  },
  {
    id: 'c2',
    rutaId: 'r-old1',
    titulo: 'Ruta Campus → La Mariscal (Completado)',
    ultimoMensaje: 'Gracias por el viaje!',
    horaUltimoMensaje: 'Ayer',
    noLeidos: 0,
    participantes: 4,
  },
];

// Mock Messages - Now includes real names
export const mockMensajes: Mensaje[] = [
  { id: 'm1', chatId: 'c1', autor: '2', autorAlias: 'María González (@Conductor5432)', contenido: 'Hola! Confirmo la ruta para hoy a las 17:30', timestamp: '14:20', esAutor: false },
  { id: 'm2', chatId: 'c1', autor: 'p1', autorAlias: 'Jorge Ramírez (@Pasajero8821)', contenido: 'Perfecto, estaré en la entrada principal', timestamp: '14:25', esAutor: false },
  { id: 'm3', chatId: 'c1', autor: '1', autorAlias: 'Tú', contenido: 'Yo también estaré ahí puntual', timestamp: '14:30', esAutor: true },
  { id: 'm4', chatId: 'c1', autor: '2', autorAlias: 'María González (@Conductor5432)', contenido: 'Perfecto, los espero en la entrada principal', timestamp: '14:35', esAutor: false },
];

// Mock Transacciones
export const mockTransacciones: Transaccion[] = [
  { id: 'tr1', fecha: '2025-01-14', tipo: 'ingreso', monto: 7.50, concepto: 'Viaje r1 - 3 pasajeros', usuario: 'Conductor5432', estado: 'completada' },
  { id: 'tr2', fecha: '2025-01-13', tipo: 'ingreso', monto: 2.00, concepto: 'Viaje r2 - 1 pasajero', usuario: 'Conductor7821', estado: 'completada' },
  { id: 'tr3', fecha: '2025-01-13', tipo: 'reversion', monto: -2.50, concepto: 'Cancelación viaje r5', usuario: 'Pasajero9102', estado: 'completada' },
  { id: 'tr4', fecha: '2025-01-12', tipo: 'egreso', monto: -50.00, concepto: 'Retiro mensual', usuario: 'Conductor3344', estado: 'completada' },
  { id: 'tr5', fecha: '2025-01-11', tipo: 'ingreso', monto: 9.00, concepto: 'Viaje r3 - 3 pasajeros', usuario: 'Conductor3344', estado: 'completada' },
  { id: 'tr6', fecha: '2025-01-10', tipo: 'egreso', monto: -127.50, concepto: 'Retiro mensual', usuario: 'Conductor5432', estado: 'pendiente' },
];

// Mock usuarios para admin
export const mockUsuarios = [
  { id: '1', alias: 'Pasajero9201', nombre: 'Carlos Mendoza', email: 'test@epn.edu.ec', rol: 'pasajero', calificacion: 4.8, estado: 'activo', fechaRegistro: '2024-09-15' },
  { id: '2', alias: 'Conductor5432', nombre: 'María González', email: 'conductor@epn.edu.ec', rol: 'conductor', calificacion: 4.9, estado: 'activo', fechaRegistro: '2024-08-20' },
  { id: '3', alias: 'Soporte001', nombre: 'Ana Rodríguez', email: 'soporte@epn.edu.ec', rol: 'soporte', calificacion: 5.0, estado: 'activo', fechaRegistro: '2024-07-01' },
  { id: '5', alias: 'Conductor7821', nombre: 'Pedro Álvarez', email: 'pedro.a@epn.edu.ec', rol: 'conductor', calificacion: 4.6, estado: 'activo', fechaRegistro: '2024-10-10' },
  { id: '6', alias: 'Conductor3344', nombre: 'Laura Suárez', email: 'laura.s@epn.edu.ec', rol: 'conductor', calificacion: 4.4, estado: 'activo', fechaRegistro: '2024-11-05' },
  { id: '7', alias: 'Pasajero8821', nombre: 'Jorge Ramírez', email: 'jorge.r@epn.edu.ec', rol: 'pasajero', calificacion: 4.7, estado: 'activo', fechaRegistro: '2024-09-22' },
  { id: '8', alias: 'Pasajero4455', nombre: 'Sofía Torres', email: 'sofia.t@epn.edu.ec', rol: 'pasajero', calificacion: 4.5, estado: 'activo', fechaRegistro: '2024-10-15' },
  { id: '9', alias: 'Pasajero1111', nombre: 'Andrés López', email: 'andres.l@epn.edu.ec', rol: 'pasajero', calificacion: 2.8, estado: 'baneado', fechaRegistro: '2024-08-30' },
];

// Audit log para admin
export const mockAuditLog = [
  { id: 'a1', fecha: '2025-01-14 15:30', accion: 'Aprobación solicitud conductor', usuario: 'Admin001', detalle: 'Aprobada solicitud de Diego Mora (u12)' },
  { id: 'a2', fecha: '2025-01-13 10:15', accion: 'Baneo de usuario', usuario: 'Soporte001', detalle: 'Baneado Pasajero1111 por 7 días - Múltiples reportes' },
  { id: 'a3', fecha: '2025-01-12 14:00', accion: 'Cambio de rol', usuario: 'Admin001', detalle: 'Ana Rodríguez promovida a Soporte' },
  { id: 'a4', fecha: '2025-01-10 09:00', accion: 'Rechazo solicitud conductor', usuario: 'Admin001', detalle: 'Rechazada solicitud de Juan Pérez - Documentos ilegibles' },
];
