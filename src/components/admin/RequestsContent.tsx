'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, Car, User, FileText, CheckCircle2,
  XCircle, Clock, Eye, Calendar
} from 'lucide-react';
import { Solicitud } from '@/data/mockData';
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

interface RequestsContentProps {
  solicitudes: Solicitud[];
}

export function RequestsContent({ solicitudes }: RequestsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Solicitud | null>(null);
  const [activeTab, setActiveTab] = useState('pendientes');

  const pendientes = solicitudes.filter(r => r.estado === 'pendiente');
  const aprobadas = solicitudes.filter(r => r.estado === 'aprobada');
  const rechazadas = solicitudes.filter(r => r.estado === 'rechazada');

  const getActiveRequests = () => {
    switch (activeTab) {
      case 'pendientes': return pendientes;
      case 'aprobadas': return aprobadas;
      case 'rechazadas': return rechazadas;
      default: return pendientes;
    }
  };

  const activeRequests = getActiveRequests();

  const handleApprove = (id: string) => {
    toast.success('Solicitud aprobada', {
      description: 'El usuario ha sido notificado y puede comenzar a conducir.'
    });
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    toast.error('Solicitud rechazada', {
      description: 'El usuario ha sido notificado del rechazo.'
    });
    setSelectedRequest(null);
  };

  const RequestCard = ({ request }: { request: Solicitud }) => (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-(--muted) flex items-center justify-center">
              <User className="w-6 h-6 text-(--muted-foreground)" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-(--foreground)">{request.nombre} {request.apellido}</h4>
              <p className="text-sm text-(--muted-foreground)">{request.email}</p>
              <div className="flex items-center gap-3 text-xs text-(--muted-foreground)">
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  <span>{request.vehiculo.marca} {request.vehiculo.modelo}</span>
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
              request.estado === 'pendiente' ? 'pendiente' :
                request.estado === 'aprobada' ? 'confirmado' : 'cancelado'
            } />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRequest(request)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-(--foreground)">Solicitudes de Conductor</h1>
        <p className="text-(--muted-foreground)">Revisa y gestiona las solicitudes para ser conductor</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-(--foreground)">{pendientes.length}</p>
              <p className="text-xs text-(--muted-foreground)">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-(--foreground)">{aprobadas.length}</p>
              <p className="text-xs text-(--muted-foreground)">Aprobadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-(--destructive)/10 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-(--destructive)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-(--foreground)">{rechazadas.length}</p>
              <p className="text-xs text-(--muted-foreground)">Rechazadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendientes">
            Pendientes
            <Badge variant="secondary" className="ml-2">{pendientes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
          <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
            {activeRequests.length === 0 && (
              <div className="text-center py-12 text-(--muted-foreground)">
                No hay solicitudes en esta categoría
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitud de Conductor</DialogTitle>
            <DialogDescription>
              Revisa los documentos y datos del solicitante
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4 p-4 bg-(--muted)/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-(--muted) flex items-center justify-center">
                  <User className="w-8 h-8 text-(--muted-foreground)" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedRequest.nombre} {selectedRequest.apellido}</h3>
                  <p className="text-sm text-(--muted-foreground)">{selectedRequest.email}</p>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-(--primary)" />
                  Información del Vehículo
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-(--muted-foreground)">Marca:</span>
                    <span className="ml-2 font-medium">{selectedRequest.vehiculo.marca}</span>
                  </div>
                  <div>
                    <span className="text-(--muted-foreground)">Modelo:</span>
                    <span className="ml-2 font-medium">{selectedRequest.vehiculo.modelo}</span>
                  </div>
                  <div>
                    <span className="text-(--muted-foreground)">Color:</span>
                    <span className="ml-2 font-medium">{selectedRequest.vehiculo.color}</span>
                  </div>
                  <div>
                    <span className="text-(--muted-foreground)">Placa:</span>
                    <span className="ml-2 font-medium">{selectedRequest.vehiculo.placa}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-(--primary)" />
                  Documentos
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[selectedRequest.licenciaUrl, selectedRequest.matriculaUrl].map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-(--border) rounded-lg flex items-center gap-3 hover:bg-(--muted)/50 cursor-pointer transition-colors"
                    >
                      <FileText className="w-5 h-5 text-(--muted-foreground)" />
                      <span className="text-sm font-medium">{idx === 0 ? 'Licencia' : 'Matrícula'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.estado === 'pendiente' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="text-(--destructive) hover:bg-(--destructive)/10"
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
