'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Send, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { executePayPalPayout } from '@/actions';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import type { PayoutAdmin } from '@/actions/payouts';

interface AdminTransactionsContentProps {
  payouts: PayoutAdmin[];
}

export function AdminTransactionsContent({
  payouts,
}: AdminTransactionsContentProps) {
  const [mounted, setMounted] = useState(false);
  const [loadingPayoutId, setLoadingPayoutId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'Completado';
      case 'FAILED':
        return 'Rechazada';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  };

  // Por Aprobar: (PENDING sin paypalBatchId) O (FAILED con o sin paypalBatchId)
  const toApprovePayouts = payouts.filter((payout) => {
    const status = payout.status?.toUpperCase();
    const hasBatchId =
      payout.paypalBatchId !== null &&
      payout.paypalBatchId !== undefined &&
      payout.paypalBatchId !== '';

    return (status === 'PENDING' && !hasBatchId) || status === 'FAILED';
  });

  // Pendientes: PENDING con paypalBatchId
  const pendingPayouts = payouts.filter((payout) => {
    const status = payout.status?.toUpperCase();
    const hasBatchId =
      payout.paypalBatchId !== null &&
      payout.paypalBatchId !== undefined &&
      payout.paypalBatchId !== '';

    return status === 'PENDING' && hasBatchId;
  });

  // Completadas: PAID
  const paidPayouts = payouts.filter(
    (payout) => payout.status?.toUpperCase() === 'PAID'
  );

  if (!mounted) {
    return null;
  }

  const handleExecutePayout = async (payout: PayoutAdmin) => {
    try {
      setLoadingPayoutId(payout.publicId);

      // Obtener el nombre del conductor desde el objeto driver
      const driverAlias = payout.driver?.publicId || 'UNKNOWN';

      const response = await executePayPalPayout(payout.publicId, driverAlias);

      if (response.success) {
        toast.success('Pago aprobado y enviado a PayPal');
        // Aquí podrías agregar una recarga de datos
        window.location.reload();
      } else {
        toast.error(response.message || 'Error al aprobar el pago');
      }
    } catch (error) {
      console.error('Error executing payout:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoadingPayoutId(null);
    }
  };

  return (
    <>
      {loadingPayoutId && <FullScreenLoader />}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transacciones de Pagos</h2>
          <p className="text-gray-600 mt-1">
            Total de solicitudes de pago: {payouts.length}
          </p>
        </div>

        <Tabs defaultValue="to-approve" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="to-approve" className="relative">
              Por Aprobar
              {toApprovePayouts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {toApprovePayouts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pendientes
              {pendingPayouts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingPayouts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid" className="relative">
              Completadas
              {paidPayouts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {paidPayouts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="to-approve" className="space-y-4 mt-6">
            {toApprovePayouts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No hay pagos por aprobar</p>
              </div>
            ) : (
              toApprovePayouts.map((payout) => (
                <Card
                  key={payout.publicId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-gray-900 text-lg">
                              ${parseFloat(payout.amount).toFixed(2)}
                            </p>
                            <Badge className={getStatusColor(payout.status)}>
                              {getStatusLabel(payout.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {payout.period}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleExecutePayout(payout)}
                        disabled={loadingPayoutId === payout.publicId}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
                      >
                        Aprobar Pago
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{payout.driver?.paypalEmail || 'Email no disponible'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>ID: {payout.publicId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Creado: {new Date(payout.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>

                    {payout.lastError && (
                      <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                        Error: {payout.lastError}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingPayouts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No hay pagos pendientes en envío</p>
              </div>
            ) : (
              pendingPayouts.map((payout) => (
                <Card
                  key={payout.publicId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            ${parseFloat(payout.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payout.driver?.paypalEmail || 'Email no disponible'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(payout.status)}>
                        {getStatusLabel(payout.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{payout.period}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>ID Batch: {payout.paypalBatchId || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="paid" className="space-y-4 mt-6">
            {paidPayouts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No hay pagos completados</p>
              </div>
            ) : (
              paidPayouts.map((payout) => (
                <Card
                  key={payout.publicId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            ${parseFloat(payout.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payout.driver?.paypalEmail || 'Email no disponible'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(payout.status)}>
                        {getStatusLabel(payout.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{payout.period}</span>
                      </div>
                      <div className="text-gray-600">
                        {payout.paidAt && (
                          <>
                            <span className="text-xs text-gray-500">Pagado: </span>
                            {new Date(payout.paidAt).toLocaleDateString('es-ES')}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
