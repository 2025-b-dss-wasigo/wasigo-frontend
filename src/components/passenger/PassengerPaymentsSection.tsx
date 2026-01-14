'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Payment } from '@/interfaces/responses/payments/Payment.interface'
import { getMyPayments } from '@/actions'
import { DollarSign, Loader2, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface PassengerPaymentsSectionProps {
  isPreview?: boolean
}

export function PassengerPaymentsSection({ isPreview = true }: PassengerPaymentsSectionProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        const response = await getMyPayments()

        if (response.success) {
          setPayments(response.data.data || [])
        } else {
          setError(response.message || 'Error al cargar pagos')
        }
      } catch (err) {
        console.error('Error fetching payments:', err)
        setError('Error al conectar con el servidor')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const paidPayments = payments.filter(p => p.status === 'PAID')
  const pendingPayments = payments.filter(p => p.status === 'PENDING')

  // Limitar a 2 pagos por categoría solo si es una vista previa
  const displayedPaidPayments = isPreview ? paidPayments.slice(0, 2) : paidPayments
  const displayedPendingPayments = isPreview ? pendingPayments.slice(0, 2) : pendingPayments

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-green-500 hover:bg-green-600">Pagado</Badge>
    case 'PENDING':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>
    case 'FAILED':
      return <Badge className="bg-red-500 hover:bg-red-600">Fallido</Badge>
    case 'CANCELLED':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Cancelado</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: es })
  } catch {
    return dateString
  }
}

const PaymentCard = ({ payment }: { payment: Payment }) => (
  <Card className="mb-3">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-base">
            {payment.booking?.route?.destinoBase || 'Destino desconocido'}
          </CardTitle>
          <CardDescription className="text-xs">
            Ruta: {payment.booking?.route?.publicId}
          </CardDescription>
        </div>
        {getStatusBadge(payment.status)}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monto:</span>
          <span className="font-semibold">
            ${payment.amount} {payment.currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Método:</span>
          <span>{payment.method}</span>
        </div>
        {payment.paidAt && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Pagado:</span>
            <span className="text-xs">{formatDate(payment.paidAt)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Fecha de Reserva:</span>
          <span className="text-xs">{formatDate(payment.createdAt)}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

if (isLoading) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Mis Pagos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  )
}

if (error) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Mis Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-red-500">{error}</p>
      </CardContent>
    </Card>
  )
}

return (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Mis Pagos
      </CardTitle>
      <CardDescription>
        Historial de pagos realizados en tus reservas
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="paid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paid">
            Pagados ({paidPayments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({pendingPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paid" className="mt-4">
          {displayedPaidPayments.length > 0 ? (
            <>
              <div className="space-y-3">
                {displayedPaidPayments.map((payment) => (
                  <PaymentCard key={payment.publicId} payment={payment} />
                ))}
              </div>
              {paidPayments.length > 2 && isPreview && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4"
                >
                  <Link href="/passenger/payments" className="flex items-center justify-center gap-2">
                    Ver todos ({paidPayments.length})
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No hay pagos completados</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {displayedPendingPayments.length > 0 ? (
            <>
              <div className="space-y-3">
                {displayedPendingPayments.map((payment) => (
                  <PaymentCard key={payment.publicId} payment={payment} />
                ))}
              </div>
              {pendingPayments.length > 2 && isPreview && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4"
                >
                  <Link href="/passenger/payments" className="flex items-center justify-center gap-2">
                    Ver todos ({pendingPayments.length})
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No hay pagos pendientes</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
)
}
