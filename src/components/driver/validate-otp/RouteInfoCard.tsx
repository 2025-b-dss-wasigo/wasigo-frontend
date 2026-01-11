import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock } from 'lucide-react';

interface RouteInfoCardProps {
  route: {
    id: string;
    lugarSalida: string;
    destino: string;
    horaSalida: string;
    pasajeros: Array<{ id: string }>;
  };
  onChangeRoute: () => void;
}

export function RouteInfoCard({ route, onChangeRoute }: RouteInfoCardProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {route.lugarSalida} → {route.destino}
              </h3>
              <p className="text-sm text-muted-foreground">
                Hoy a las {route.horaSalida}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onChangeRoute}>
            Cambiar ruta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
