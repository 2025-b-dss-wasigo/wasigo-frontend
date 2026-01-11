'use client';

import { Button } from '@radix-ui/themes';
import { CreditCard } from 'lucide-react';

interface Transaccion {
  id: string;
  concepto: string;
  usuario: string;
  fecha: string;
  tipo: 'ingreso' | 'egreso' | 'pendiente';
  monto: number;
}

interface TransactionsSectionProps {
  transacciones: Transaccion[];
}

export function TransactionsSection({ transacciones }: TransactionsSectionProps) {
  return (
    <div className="card-elevated">
      <div className="p-4 border-b border-(--border) flex items-center justify-between">
        <h3 className="text-lg font-semibold text-(--foreground)">Últimas Transacciones</h3>
        <Button color="gray" variant="soft">
          Ver todas
        </Button>
      </div>

      <div className="divide-y divide-(--border)">
        {transacciones.slice(0, 5).map((tx) => (
          <div key={tx.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.tipo === 'ingreso'
                  ? 'bg-(--success)/10'
                  : tx.tipo === 'egreso'
                    ? 'bg-(--destructive)/10'
                    : 'bg-(--warning)/10'
                  }`}
              >
                <CreditCard
                  className={`w-5 h-5 ${tx.tipo === 'ingreso'
                    ? 'text-(--success)'
                    : tx.tipo === 'egreso'
                      ? 'text-(--destructive)'
                      : 'text-(--warning)'
                    }`}
                />
              </div>
              <div>
                <p className="font-medium text-(--foreground) text-1">{tx.concepto}</p>
                <p className="text-xs text-(--muted-foreground)">
                  {tx.usuario} • {tx.fecha}
                </p>
              </div>
            </div>
            <p
              className={`font-semibold ${tx.tipo === 'ingreso'
                ? 'text-(--success)'
                : tx.tipo === 'egreso'
                  ? 'text-(--destructive)'
                  : 'text-(--warning)'
                }`}
            >
              {tx.tipo === 'ingreso' ? '+' : ''}{tx.monto < 0 ? '' : '$'}
              {Math.abs(tx.monto).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
