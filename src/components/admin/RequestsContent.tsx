'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User, FileText, CheckCircle2,
  XCircle, Eye, Calendar, FileCheck, AlertCircle
} from 'lucide-react';
import { Driver } from '@/interfaces/responses/admin/GetDriverRequestsResponse';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequestStatus } from '@/actions/admin/getDriverRequests';
import { getDriverRequestDetail, approveDriverWithDocuments, rejectDriverWithDocuments } from '@/actions';
import { RequestDetailResponse } from '@/interfaces/responses/admin/RequestDetailResponse';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { Textarea } from '@/components/ui/textarea';

interface RequestsContentProps {
  drivers: Driver[];
  currentStatus: RequestStatus;
}

function RequestCard({ request, onViewDetail }: { request: Driver; onViewDetail: (id: string) => void }) {
  const [selectedRequest, setSelectedRequest] = useState<RequestDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleViewDetail = async () => {
    setLoading(true);
    try {
      const response = await getDriverRequestDetail(request.publicId);
      if (response.data) {
        setSelectedRequest(response.data);
      } else {
        toast.error('Error', { description: 'No se pudo cargar el detalle de la solicitud' });
      }
    } catch (error) {
      toast.error('Error', { description: 'Ocurrió un error al cargar el detalle' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setApproving(true);
    try {
      const documentIds = selectedRequest.driver.documents.map(doc => doc.publicId);
      const result = await approveDriverWithDocuments(selectedRequest.driver.publicId, documentIds);

      if (result.success) {
        toast.success('¡Éxito!', {
          description: 'Solicitud y documentos aprobados exitosamente'
        });
        setSelectedRequest(null);
      } else {
        toast.error('Error', { description: result.message || 'No se pudo aprobar la solicitud' });
      }
    } catch (error) {
      toast.error('Error', { description: 'Ocurrió un error al aprobar la solicitud' });
    } finally {
      setApproving(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error('Error', { description: 'Debe ingresar un motivo de rechazo' });
      return;
    }

    if (!selectedRequest) return;

    setApproving(true);
    try {
      const documentIds = selectedRequest.driver.documents.map(doc => doc.publicId);
      const result = await rejectDriverWithDocuments(selectedRequest.driver.publicId, documentIds, rejectReason);

      if (result.success) {
        toast.error('Solicitud rechazada', {
          description: 'Solicitud y documentos rechazados exitosamente'
        });
        setRejectReason('');
        setShowRejectDialog(false);
        setSelectedRequest(null);
      } else {
        toast.error('Error', { description: result.message || 'No se pudo rechazar la solicitud' });
      }
    } catch (error) {
      toast.error('Error', { description: 'Ocurrió un error al rechazar la solicitud' });
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
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
                  <div className="flex items-center gap-1" suppressHydrationWarning>
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
                onClick={handleViewDetail}
                disabled={loading}
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud de Conductor</DialogTitle>
            <DialogDescription>
              Revisa toda la información y documentos del solicitante
            </DialogDescription>
          </DialogHeader>

          {!loading && selectedRequest ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4 p-4 bg-(--muted)/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-(--muted) flex items-center justify-center">
                  <User className="w-8 h-8 text-(--muted-foreground)" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedRequest.driver.user.profile.nombre} {selectedRequest.driver.user.profile.apellido}
                  </h3>
                  <p className="text-sm text-(--muted-foreground)">@{selectedRequest.driver.user.alias}</p>
                  <p className="text-sm text-(--muted-foreground)">{selectedRequest.driver.paypalEmail}</p>
                  <p className="text-xs text-(--muted-foreground) mt-2">ID: {selectedRequest.driver.publicId}</p>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="font-semibold mb-3">Información Personal</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-(--muted-foreground)">Teléfono:</span>
                    <span className="ml-2 font-medium">{selectedRequest.driver.user.profile.celular}</span>
                  </div>
                  <div>
                    <span className="text-(--muted-foreground)">Rating promedio:</span>
                    <span className="ml-2 font-medium">{selectedRequest.driver.user.profile.ratingPromedio}</span>
                  </div>
                  <div>
                    <span className="text-(--muted-foreground)">Total viajes:</span>
                    <span className="ml-2 font-medium">{selectedRequest.driver.user.profile.totalViajes}</span>
                  </div>
                  <div suppressHydrationWarning>
                    <span className="text-(--muted-foreground)">Fecha de solicitud:</span>
                    <span className="ml-2 font-medium">{new Date(selectedRequest.driver.fechaSolicitud).toLocaleDateString('es-EC')}</span>
                  </div>
                </div>
              </div>

              {/* Vehicles */}
              {selectedRequest.driver.vehicles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Vehículos</h4>
                  <div className="space-y-3">
                    {selectedRequest.driver.vehicles.map((vehicle) => (
                      <div key={vehicle.publicId} className="p-3 border border-(--border) rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-(--muted-foreground)">Marca:</span>
                            <span className="ml-2 font-medium">{vehicle.marca}</span>
                          </div>
                          <div>
                            <span className="text-(--muted-foreground)">Modelo:</span>
                            <span className="ml-2 font-medium">{vehicle.modelo}</span>
                          </div>
                          <div>
                            <span className="text-(--muted-foreground)">Color:</span>
                            <span className="ml-2 font-medium">{vehicle.color}</span>
                          </div>
                          <div>
                            <span className="text-(--muted-foreground)">Placa:</span>
                            <span className="ml-2 font-medium">{vehicle.placa}</span>
                          </div>
                          <div>
                            <span className="text-(--muted-foreground)">Asientos disponibles:</span>
                            <span className="ml-2 font-medium">{vehicle.asientosDisponibles}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-(--primary)" />
                  Documentos
                </h4>
                <div className="space-y-3">
                  {selectedRequest.documentsWithUrls.map((doc) => (
                    <div key={doc.publicId} className="p-3 border border-(--border) rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-(--muted-foreground)" />
                          <div>
                            <p className="font-medium text-(--foreground)">{doc.tipo}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.signedUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.driver.estado === 'PENDIENTE' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="text-(--destructive) hover:bg-(--destructive)/10"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={approving}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleApprove}
                    disabled={approving}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Screen Loader */}
      {approving && <FullScreenLoader />}

      {/* Reject Reason Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Solicitud</AlertDialogTitle>
            <AlertDialogDescription>
              Debe ingresar un motivo para rechazar esta solicitud. El conductor será notificado.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-(--destructive)/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-(--destructive) mt-0.5 shrink-0" />
              <p className="text-sm text-(--destructive)">El motivo de rechazo es obligatorio</p>
            </div>
            <Textarea
              placeholder="Ingresa el motivo del rechazo..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-25"
            />
          </div>

          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-(--destructive) hover:bg-(--destructive)/90"
            >
              Rechazar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function RequestsContent({ drivers, currentStatus }: RequestsContentProps) {
  const router = useRouter();

  const handleTabChange = (status: RequestStatus) => {
    router.push(`?estado=${status}`);
  };

  return (
    <div className="space-y-4">
      {drivers.length === 0 ? (
        <div className="text-center py-12 text-(--muted-foreground)">
          No hay solicitudes en esta categoría
        </div>
      ) : (
        drivers.map((request) => (
          <RequestCard key={request.publicId} request={request} onViewDetail={() => { }} />
        ))
      )}
    </div>
  );
}

export function RequestsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-(--foreground)">Solicitudes de Conductor</h1>
      <p className="text-(--muted-foreground)">Revisa y gestiona las solicitudes para ser conductor</p>
    </div>
  );
}

export function RequestsTabs({ drivers, currentStatus }: { drivers: Driver[]; currentStatus: RequestStatus }) {
  const router = useRouter();

  const handleTabChange = (status: RequestStatus) => {
    router.push(`?estado=${status}`);
  };

  return (
    <Tabs value={currentStatus} onValueChange={(value) => handleTabChange(value as RequestStatus)}>
      <TabsList>
        <TabsTrigger value="PENDIENTE">
          Pendientes
          <Badge variant="secondary" className="ml-2">{currentStatus === 'PENDIENTE' ? drivers.length : '-'}</Badge>
        </TabsTrigger>
        <TabsTrigger value="APROBADO">
          Aprobadas
          <Badge variant="secondary" className="ml-2">{currentStatus === 'APROBADO' ? drivers.length : '-'}</Badge>
        </TabsTrigger>
        <TabsTrigger value="RECHAZADO">
          Rechazadas
          <Badge variant="secondary" className="ml-2">{currentStatus === 'RECHAZADO' ? drivers.length : '-'}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={currentStatus} className="mt-4">
        <RequestsContent drivers={drivers} currentStatus={currentStatus} />
      </TabsContent>
    </Tabs>
  );
}
