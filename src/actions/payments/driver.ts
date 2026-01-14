'use server';

export interface DriverPayment {
  publicId: string;
  bookingId: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  paidAt: string;
  booking: {
    publicId: string;
    route: {
      publicId: string;
      origen: string;
      fecha: string;
      horaSalida: string;
      destinoBase: string;
      precioPasajero: string;
      estado: string;
      mensaje: string;
    };
  };
}

export interface DriverPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    data: DriverPayment[];
  };
  timestamp: string;
}

export async function getDriverPayments(): Promise<DriverPaymentsResponse> {
  try {
    // Aquí iría la llamada real al backend
    // const response = await fetchWithToken('/payments/driver');

    // Por ahora, retornamos datos mock
    return {
      success: true,
      message: 'Pagos recibidos por el conductor',
      data: {
        data: [
          {
            publicId: 'PAY_6TGVHTUP',
            bookingId: 'BKG_N6Y6TRLP',
            amount: '1.50',
            currency: 'USD',
            method: 'PAYPAL',
            status: 'PAID',
            createdAt: '2026-01-13T02:05:25.201Z',
            paidAt: '2026-01-13T02:10:21.927Z',
            booking: {
              publicId: 'BKG_N6Y6TRLP',
              route: {
                publicId: 'RTE_JTWBTJ7B',
                origen: 'CAMPUS_PRINCIPAL',
                fecha: '2026-01-17',
                horaSalida: '16:30:00',
                destinoBase: 'Martha Bucaram De Roldos, Quito, Ecuador',
                precioPasajero: '1.50',
                estado: 'FINALIZADA',
                mensaje: 'Conductor puntual',
              },
            },
          },
          {
            publicId: 'PAY_KKKGDXZK',
            bookingId: 'BKG_X8R4S9MT',
            amount: '1.50',
            currency: 'USD',
            method: 'PAYPAL',
            status: 'PAID',
            createdAt: '2026-01-13T02:04:53.286Z',
            paidAt: '2026-01-13T02:05:03.906Z',
            booking: {
              publicId: 'BKG_X8R4S9MT',
              route: {
                publicId: 'RTE_MAV6J42S',
                origen: 'CAMPUS_PRINCIPAL',
                fecha: '2026-01-16',
                horaSalida: '08:00:00',
                destinoBase: 'La Ecuatoriana, Quito, Ecuador',
                precioPasajero: '1.50',
                estado: 'FINALIZADA',
                mensaje: 'Conductor puntual',
              },
            },
          },
        ],
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching driver payments:');
    throw new Error('Failed to fetch driver payments');
  }
}
