'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Driver } from '@/interfaces/responses/admin/GetDriverRequestsResponse';
import type { PayoutAdmin } from '@/actions/payouts';

interface AdminDashboardContentProps {
  driverRequests: Driver[];
  payouts: PayoutAdmin[];
}

export function AdminDashboardContent({
  driverRequests,
  payouts,
}: AdminDashboardContentProps) {
  const router = useRouter();

  const getRequestStatusColor = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'APROBADO':
        return 'bg-green-100 text-green-800';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutStatusColor = (status: string) => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Driver Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-(--primary)" />
            <div>
              <CardTitle>Solicitudes de Conductor</CardTitle>
              <p className="text-xs text-(--muted-foreground) mt-1">Últimas solicitudes pendientes de revisión</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {driverRequests.length === 0 ? (
            <div className="text-center py-8 text-(--muted-foreground)">
              No hay solicitudes de conductor
            </div>
          ) : (
            <>
              {driverRequests.map((request) => (
                <div
                  key={request.publicId}
                  className="flex items-center justify-between p-3 border border-(--border) rounded-lg hover:bg-(--muted)/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-(--foreground) text-sm">
                      {request.userName}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {new Date(request.fechaSolicitud).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                  <Badge className={getRequestStatusColor(request.estado)}>
                    {request.estado}
                  </Badge>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/admin/requests')}
              >
                Ver todas las solicitudes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-(--primary)" />
            <div>
              <CardTitle>Historial de Pagos</CardTitle>
              <p className="text-xs text-(--muted-foreground) mt-1">Últimos pagos a conductores</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-(--muted-foreground)">
              No hay pagos registrados
            </div>
          ) : (
            <>
              {payouts.map((payout) => (
                <div
                  key={payout.publicId}
                  className="flex items-center justify-between p-3 border border-(--border) rounded-lg hover:bg-(--muted)/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-(--foreground) text-sm">
                      ${parseFloat(payout.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {payout.driver.paypalEmail} • {payout.period}
                    </p>
                  </div>
                  <Badge className={getPayoutStatusColor(payout.status)}>
                    {payout.status}
                  </Badge>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/admin/transactions')}
              >
                Ver todos los pagos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
