'use server'

import { fetchWithToken } from '@/actions/fetch-with-token'

interface ExecutePayPalPayoutResponse {
  success: boolean
  message: string
  data: {
    paypalBatchId: string
  }
  timestamp: string
}

export async function executePayPalPayout(
  payoutId: string,
  driverAlias: string
) {
  try {
    // Generar Idempotency-Key
    // Formato: PYO_{payoutId}_{driverAlias}_{YYYYMMDD}{HHMM}
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    const dateStr = `${year}${month}${day}`
    const timeStr = `${hours}${minutes}`
    const idempotencyKey = `PYO_${payoutId}_${driverAlias}_${dateStr}${timeStr}`

    const response = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/payouts/${payoutId}/paypal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Error al ejecutar el payout',
        data: null,
      }
    }

    return response as ExecutePayPalPayoutResponse
  } catch (error) {
    console.error('Error executing PayPal payout:', error)
    return {
      success: false,
      message: 'Error al conectar con el servidor',
      data: null,
    }
  }
}
