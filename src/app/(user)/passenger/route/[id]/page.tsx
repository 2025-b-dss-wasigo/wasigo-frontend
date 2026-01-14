// app/passenger/bookings/[id]/map/page.tsx
import { getBookingMap } from '@/actions/bookings/getBookingMap';
import { PassengerRouteDetailMap } from '@/components/passenger/PassengerRouteDetailMap';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mapa de tu Reserva',
  description: 'Visualiza tu ruta en tiempo real y sigue el viaje con el conductor',
};

interface BookingMapPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingMapPage({ params }: BookingMapPageProps) {
  const { id } = await params;

  let mapData = null;
  let error = null;

  try {
    const response = await getBookingMap(id);

    if (!response.success) {
      error = response.message || 'No se pudo cargar el mapa de la reserva';
    } else {
      mapData = response.data;
    }
  } catch (err: any) {
    console.error('Error fetching booking map:', err);
    error = 'Error al cargar el mapa de la reserva';
  }

  // Si la reserva no está activa o hay error
  if (error || !mapData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Mapa de la Reserva</h1>
          <p className="text-(--muted-foreground)">Visualiza tu ruta en tiempo real</p>
        </div>

        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            📍
          </div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Reserva No Disponible</h3>
          <p className="text-yellow-800 mb-4">
            {error || 'Esta reserva no está disponible para visualización en tiempo real.'}
          </p>
          <a href="/passenger/bookings">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              ← Volver a Mis Reservas
            </button>
          </a>
        </div>
      </div>
    );
  }

  // Obtener coordenadas del origen (primera parada)
  const sortedStops = [...mapData.stops].sort((a, b) => a.orden - b.orden);
  const originStop = sortedStops[0];
  const originCoordinates = {
    lat: parseFloat(originStop.lat),
    lng: parseFloat(originStop.lng),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--foreground)">Mapa de tu Reserva</h1>
        <p className="text-(--muted-foreground)">Sigue tu ruta en tiempo real</p>
      </div>

      <PassengerRouteDetailMap
        bookingId={id}
        originCoordinates={originCoordinates}
        mapData={mapData}
      />
    </div>
  );
}