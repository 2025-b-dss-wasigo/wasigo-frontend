import { Route, Users, Wallet, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DriverStatsProps {
  stats?: {
    rutasActivas?: number;
    viajesCompletados?: number;
    fondosDisponibles?: number;
    calificacion?: number;
  };
}

export function DriverStatsSection({ stats }: DriverStatsProps) {
  const defaultStats = {
    rutasActivas: stats?.rutasActivas ?? 0,
    viajesCompletados: stats?.viajesCompletados ?? 0,
    fondosDisponibles: stats?.fondosDisponibles ?? 0,
    calificacion: stats?.calificacion ?? 0,
  };

  const statItems = [
    {
      title: 'Rutas Activas',
      value: defaultStats.rutasActivas,
      icon: Route,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Viajes Completados',
      value: defaultStats.viajesCompletados,
      icon: Users,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Fondos Disponibles',
      value: `$${defaultStats.fondosDisponibles.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Calificación',
      value: defaultStats.calificacion.toFixed(1),
      icon: Star,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{item.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
                <div className={`${item.color} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
