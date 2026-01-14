'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, Filter, Download, User,
  ArrowUpRight, ArrowDownRight, RotateCcw,
  TrendingUp, CheckCircle2, Calendar
} from 'lucide-react';


export function TransactionsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('todo');


  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return <ArrowUpRight className="w-4 h-4 text-(--success)" />;
      case 'egreso': return <ArrowDownRight className="w-4 h-4 text-(--info)" />;
      case 'pendiente': return <RotateCcw className="w-4 h-4 text-(--warning)" />;
      default: return null;
    }
  };

  const getTypeBadge = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return <Badge className="bg-(--success)/10 text-(--success)">Ingreso</Badge>;
      case 'egreso': return <Badge className="bg-(--info)/10 text-(--info)">Retiro</Badge>;
      case 'reversion': return <Badge className="bg-(--warning)/10 text-(--warning)">Reversión</Badge>;
      default: return <Badge>Otro</Badge>;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completada': return <Badge className="bg-(--success)/10 text-(--success)">Completada</Badge>;
      case 'pendiente': return <Badge className="bg-(--warning)/10 text-(--warning)">Pendiente</Badge>;
      case 'fallida': return <Badge className="bg-(--destructive)/10 text-(--destructive)">Fallida</Badge>;
      default: return <Badge>Desconocido</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Panel de Transacciones</h1>
          <p className="text-(--muted-foreground)">Historial financiero de la plataforma</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
          <Input
            placeholder="Buscar por concepto o usuario..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="hoy">Hoy</TabsTrigger>
              <TabsTrigger value="semana">Esta Semana</TabsTrigger>
              <TabsTrigger value="mes">Este Mes</TabsTrigger>
              <TabsTrigger value="todo">Todo</TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="mt-4">
              {/* <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-(--muted)/30 rounded-lg hover:bg-(--muted)/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.tipo === 'ingreso' ? 'bg-(--success)/10' :
                        tx.tipo === 'egreso' ? 'bg-(--info)/10' : 'bg-(--warning)/10'
                        }`}>
                        {getTypeIcon(tx.tipo)}
                      </div>
                      <div>
                        <p className="font-medium text-(--foreground)">{tx.concepto}</p>
                        <div className="flex items-center gap-3 text-sm text-(--muted-foreground)">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {tx.usuario}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(tx.fecha).toLocaleDateString('es-EC')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(tx.tipo)}
                        {getStatusBadge(tx.estado)}
                      </div>
                      <p className={`font-bold text-lg ${tx.tipo === 'ingreso' ? 'text-(--success)' :
                        tx.tipo === 'egreso' ? 'text-(--info)' : 'text-(--warning)'
                        }`}>
                        {tx.monto >= 0 ? '+' : ''}${Math.abs(tx.monto).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
