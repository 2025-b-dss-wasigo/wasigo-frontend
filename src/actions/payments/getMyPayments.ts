'use server'

import { PaymentsResponse } from '@/interfaces/responses/payments/Payment.interface'
import { ApiResponse } from '@/interfaces'
import { fetchWithToken } from '..'

export async function getMyPayments() {
  try {
    const response = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/my`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response as PaymentsResponse

  } catch (error) {
    console.error('Error fetching payments:', error)
    return {
      success: false,
      message: 'Error al conectar con el servidor',
      data: { data: [] },
      timestamp: new Date().toISOString(),
    } as PaymentsResponse
  }
}
