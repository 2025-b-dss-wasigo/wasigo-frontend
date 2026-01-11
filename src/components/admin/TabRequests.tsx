import { Suspense } from 'react';
import { getDriverRequests, RequestStatus } from '@/actions/admin/getDriverRequests';
import { Driver } from '@/interfaces/responses/admin/GetDriverRequestsResponse';
import { RequestsTableSkeleton } from '@/components/common/SkeletonLoaders';
import { Card, CardContent } from '@/components/ui/card';
import {
  User, FileCheck, Calendar, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';

interface TabRequestsProps {
  status: RequestStatus;
}

async function TabRequestsContent({ status }: TabRequestsProps) {
  const response = await getDriverRequests(status);
  const solicitudes = response.data?.drivers || [];

  if (solicitudes.length === 0) {
    return (
      <div className="text-center py-12 text-(--muted-foreground)">
        No hay solicitudes en esta categoría
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solicitudes.map((request) => (
        <RequestCardRow key={request.publicId} request={request} />
      ))}
    </div>
  );
}

function RequestCardRow({ request }: { request: Driver }) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-(--muted) flex items-center justify-center">
              <User className="w-6 h-6 text-(--muted-foreground)" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-(--foreground)">{request.userName}</h4>
              <p className="text-sm text-(--muted-foreground)">{request.paypalEmail}</p>
              <div className="flex items-center gap-3 text-xs text-(--muted-foreground)">
                <div className="flex items-center gap-1">
                  <FileCheck className="w-3 h-3" />
                  <span>{request.documentsCount} documento(s) - {request.pendingDocuments} pendiente(s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(request.fechaSolicitud).toLocaleDateString('es-EC')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={
              request.estado === 'PENDIENTE' ? 'pendiente' :
                request.estado === 'APROBADO' ? 'confirmado' : 'cancelado'
            } />
            <Button
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TabRequests({ status }: TabRequestsProps) {
  return (
    <Suspense fallback={<RequestsTableSkeleton />}>
      <TabRequestsContent status={status} />
    </Suspense>
  );
}
