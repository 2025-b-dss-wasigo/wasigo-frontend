'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListLoader, ListPagination } from '@/components/common/LoadingSpinner';
import {
  Search, Filter, Download, Calendar, User,
  ArrowUpRight, ArrowDownRight, RotateCcw,
  DollarSign, TrendingUp, Clock, CheckCircle2
} from 'lucide-react';
import { mockTransacciones } from '@/data/mockData';

const ITEMS_PER_PAGE = 8;

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('todo');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const ingresos = mockTransacciones.filter(t => t.tipo === 'ingreso');
  const egresos = mockTransacciones.filter(t => t.tipo === 'egreso');
  const reversiones = mockTransacciones.filter(t => t.tipo === 'reversion');

  const totalIngresos = ingresos.reduce((acc, t) => acc + t.monto, 0);
  const totalEgresos = Math.abs(egresos.reduce((acc, t) => acc + t.monto, 0));
  const totalReversiones = Math.abs(reversiones.reduce((acc, t) => acc + t.monto, 0));

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'ingreso': return <ArrowUpRight className="w-4 h-4 text-(--success)" />;
      case 'egreso': return <ArrowDownRight className="w-4 h-4 text-(--info)" />;
      case 'reversion': return <RotateCcw className="w-4 h-4 text-(--warning)" />;
      default: return <DollarSign className="w-4 h-4" />;
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

  const filteredTransactions = mockTransacciones.filter(t =>
    t.concepto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.usuario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePeriodChange = (newPeriod: string) => {
    setLoading(true);
    setPeriod(newPeriod);
    setCurrentPage(1);
    setTimeout(() => setLoading(false), 300);
  };

  const handleSearch = (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    setCurrentPage(1);
    setTimeout(() => setLoading(false), 300);
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-(--success)/10 to-(--success)/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-(--success)/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-(--success)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">${totalIngresos.toFixed(2)}</p>
                <p className="text-xs text-(--muted-foreground)">Total Ingresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-(--info)/10 rounded-full flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-(--info)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">${totalEgresos.toFixed(2)}</p>
                <p className="text-xs text-(--muted-foreground)">Total Retiros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-(--warning)/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-(--warning)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">${totalReversiones.toFixed(2)}</p>
                <p className="text-xs text-(--muted-foreground)">Reversiones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-(--primary)/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-(--primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">{mockTransacciones.length}</p>
                <p className="text-xs text-(--muted-foreground)">Total Transacciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
          <Input
            placeholder="Buscar por concepto o usuario..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
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
          <Tabs value={period} onValueChange={handlePeriodChange}>
            <TabsList>
              <TabsTrigger value="hoy">Hoy</TabsTrigger>
              <TabsTrigger value="semana">Esta Semana</TabsTrigger>
              <TabsTrigger value="mes">Este Mes</TabsTrigger>
              <TabsTrigger value="todo">Todo</TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="mt-4">
              {loading ? (
                <ListLoader count={5} />
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedTransactions.map((tx) => (
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
                  </div>
                  <ListPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredTransactions.length}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
