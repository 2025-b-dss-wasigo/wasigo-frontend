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
import { mockTransacciones } from '@/data/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function EarningsPage() {

  const [period, setPeriod] = useState('mes');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const stats = {
    totalMes: 127.50,
    totalSemana: 32.00,
    pendiente: 24.50,
    disponible: 103.00,
    viajes: 48,
    cambio: 12.5
  };

  // Simulate loading when changing period
  const handlePeriodChange = (newPeriod: string) => {
    setLoading(true);
    setPeriod(newPeriod);
    setTimeout(() => setLoading(false), 500);
  };

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
                  <p className="text-3xl font-bold mt-1">${stats.disponible.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold mt-1 text-(--foreground)">${stats.totalMes.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{stats.cambio}% vs mes anterior</span>
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
                  <p className="text-2xl font-bold mt-1 text-(--foreground)">${stats.pendiente.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold mt-1 text-(--foreground)">{stats.viajes}</p>
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
            <Tabs value={period} onValueChange={handlePeriodChange}>
              <TabsList>
                <TabsTrigger value="semana">Esta Semana</TabsTrigger>
                <TabsTrigger value="mes">Este Mes</TabsTrigger>
                <TabsTrigger value="todo">Todo</TabsTrigger>
              </TabsList>

              <TabsContent value={period} className="mt-4">
                {loading ? (
                  <ListLoader count={4} />
                ) : (
                  <div className="space-y-3">
                    {mockTransacciones.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 bg-(--muted)/30 rounded-lg hover:bg-(--muted)/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.tipo === 'ingreso'
                            ? 'bg-emerald-500/10'
                            : 'bg-blue-500/10'
                            }`}>
                            {tx.tipo === 'ingreso' ? (
                              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-(--foreground)">{tx.concepto}</p>
                            <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(tx.fecha).toLocaleDateString('es-EC', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${tx.tipo === 'ingreso' ? 'text-emerald-500' : 'text-(--destructive)'
                            }`}>
                            {tx.tipo === 'ingreso' ? '+' : '-'}${tx.monto.toFixed(2)}
                          </p>
                          <StatusBadge status={tx.estado === 'completada' ? 'completado' : 'pendiente'} />
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
                  <p className="text-sm text-(--muted-foreground)">maria.g@paypal.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Cambiar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
        availableBalance={stats.disponible}
        paypalEmail="maria.g@paypal.com"
      />
    </>
  );
}
