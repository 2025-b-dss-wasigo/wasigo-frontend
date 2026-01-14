// components/passenger/PassengerRouteDetailMap.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PassengerRouteMapVisualizer } from '@/components/maps/PassengerRouteMapVisualizer';
import { BookingMapData } from '@/actions/bookings/getBookingMap';

interface PassengerRouteDetailMapProps {
  bookingId: string;
  originCoordinates: { lat: number; lng: number };
  mapData: BookingMapData;
}

export function PassengerRouteDetailMap({
  bookingId,
  originCoordinates,
  mapData
}: PassengerRouteDetailMapProps) {
  // Ordenar stops por el campo "orden" de menor a mayor
  const sortedStops = (mapData?.stops || []).sort((a, b) => {
    const ordenA = a.orden || 0;
    const ordenB = b.orden || 0;
    return ordenA - ordenB;
  });

  return (
    <div className="w-full h-[calc(100vh-12rem)]">
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          <PassengerRouteMapVisualizer
            originCoordinates={originCoordinates}
            stops={sortedStops}
          />
        </CardContent>
      </Card>
    </div>
  );
}
