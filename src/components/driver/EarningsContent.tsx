'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WithdrawModal } from '@/components/common/WithdrawModal';
import { ListLoader } from '@/components/common/LoadingSpinner';
import {
  DollarSign, TrendingUp, Calendar,
  ArrowUpRight, ArrowDownRight, Download, CreditCard,
  Clock, CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BalanceData } from '@/actions/payouts';
import { DriverPayment } from '@/actions/payments/driver';
import { PayoutRecord } from '@/actions/payouts/my';

interface EarningsContentProps {
  balanceData: BalanceData;
  ingresos: DriverPayment[];
  retiros: PayoutRecord[];
  paypalEmail: string | null;
  isLoading?: boolean;
}

export function EarningsContent({
  balanceData,
  ingresos,
  retiros,
  paypalEmail,
  isLoading = false,
}: EarningsContentProps) {
  const [tab, setTab] = useState('ingresos');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">Ganancias</h1>
            <p className="text-(--muted-foreground)">Resumen de tus ingresos y transacciones</p>
          </div>
          <Button variant="default" onClick={() => setWithdrawModalOpen(true)}>
            <DollarSign className="w-4 h-4 mr-2" />
            Retirar Fondos
          </Button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gradient-primary text-(--primary-foreground)">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-(--primary-foreground)/80 text-sm">Disponible para Retiro</p>
                  {isLoading ? (
                    <div className="h-8 bg-white/20 rounded w-24 mt-1"></div>
                  ) : (
                    <p className="text-3xl font-bold mt-1">${balanceData.availableForWithdrawal.toFixed(2)}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-(--muted-foreground) text-sm">Ganancias del Mes</p>
                  {isLoading ? (
                    <div className="h-7 bg-gray-200 rounded w-20 mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold mt-1 text-(--foreground)">${balanceData.monthlyEarnings.toFixed(2)}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Ingresos mensuales</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-(--muted-foreground) text-sm">Pendiente de Cobro</p>
                  {isLoading ? (
                    <div className="h-7 bg-gray-200 rounded w-20 mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold mt-1 text-(--foreground)">${balanceData.pendingCollection.toFixed(2)}</p>
                  )}
                  <p className="text-xs text-(--muted-foreground) mt-1">Viajes en proceso</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-(--muted-foreground) text-sm">Viajes Completados</p>
                  {isLoading ? (
                    <div className="h-7 bg-gray-200 rounded w-16 mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold mt-1 text-(--foreground)">{balanceData.completedTrips}</p>
                  )}
                  <p className="text-xs text-(--muted-foreground) mt-1">Este mes</p>
                </div>
                <div className="w-12 h-12 bg-(--primary)/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-(--primary)" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Historial de Transacciones</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                <TabsTrigger value="retiros">Retiros</TabsTrigger>
              </TabsList>

              <TabsContent value="ingresos" className="mt-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : ingresos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-(--muted-foreground)">No hay ingresos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ingresos.map((pago) => (
                      <div
                        key={pago.publicId}
                        className="flex items-center justify-between p-4 bg-(--muted)/30 rounded-lg hover:bg-(--muted)/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10">
                            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-medium text-(--foreground)">
                              {pago.booking?.route?.destinoBase || 'Viaje completado'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(pago.paidAt).toLocaleDateString('es-EC', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-500">
                            +${parseFloat(pago.amount).toFixed(2)}
                          </p>
                          <StatusBadge status="completado" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="retiros" className="mt-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : retiros.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-(--muted-foreground)">No hay retiros registrados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {retiros.map((retiro) => (
                      <div
                        key={retiro.publicId}
                        className="flex items-center justify-between p-4 bg-(--muted)/30 rounded-lg hover:bg-(--muted)/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
                            <ArrowDownRight className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-(--foreground)">Retiro a PayPal</p>
                            <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(retiro.paidAt || retiro.createdAt).toLocaleDateString('es-EC', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {retiro.lastError && (
                              <p className="text-xs text-red-500 mt-1">{retiro.lastError}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-(--destructive)">
                            -${parseFloat(retiro.amount).toFixed(2)}
                          </p>
                          <StatusBadge status={retiro.status === 'PAID' ? 'completado' : retiro.status === 'FAILED' ? 'rechazada' : 'pendiente'} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-(--primary)" />
              Método de Retiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-(--border) rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PP</span>
                </div>
                <div>
                  <p className="font-medium text-(--foreground)">PayPal</p>
                  {isLoading ? (
                    <div className="h-4 bg-gray-200 rounded w-48 mt-1"></div>
                  ) : (
                    <p className="text-sm text-(--muted-foreground)">{paypalEmail || 'No configurado'}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
        availableBalance={balanceData.availableForWithdrawal}
        paypalEmail={paypalEmail || 'No configurado'}
      />
    </>
  );
}
