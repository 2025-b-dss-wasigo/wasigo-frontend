'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface RouteTrackingMapProps {
  routeId: string;
  userType: 'driver' | 'passenger';
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization' | 'marker')[] = ['places', 'marker'];

interface Stop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
}

interface RouteData {
  publicId: string;
  origen: string;
  destinoBase: string;
  stops: Stop[];
  fecha: string;
  horaSalida: string;
  estado?: string;
}

export default function RouteTrackingMap({ routeId, userType }: RouteTrackingMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const stopMarkersRef = useRef<google.maps.Marker[]>([]);

  // Obtener datos de la ruta
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await fetch(`/api/routes/${routeId}`, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (response.ok) {
          const data = await response.json();
          setRouteData(data.data);

          // Validar si la ruta está finalizada
          if (data.data?.estado?.toUpperCase() === 'FINALIZADA') {
            toast.info('Ruta finalizada', {
              description: 'Esta ruta ya ha sido completada y no puede ser visualizada en tiempo real'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
        toast.error('Error al cargar datos de la ruta');
      }
    };

    if (routeId) {
      fetchRouteData();
    }
  }, [routeId]);

  // Obtener geolocalización en tiempo real
  useEffect(() => {
    if (!isLoaded) return;

    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      return;
    }

    // Ubicación inicial
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación. Verifica los permisos.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Monitorear ubicación en tiempo real
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);

        // Auto-centrar solo si el usuario no ha interactuado
        if (map && !userHasInteracted) {
          map.panTo(newLocation);
          map.setZoom(18);
        }
      },
      (error) => {
        console.error('Error al monitorear ubicación:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLoaded, map, userHasInteracted]);

  // Crear marcador del usuario
  useEffect(() => {
    if (!map || !userLocation || !isLoaded) return;

    // Eliminar marcador anterior
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Crear nuevo marcador con símbolo de círculo
    const userMarkerColor = userType === 'driver' ? '#3B82F6' : '#10B981';
    const userMarker = new google.maps.Marker({
      map,
      position: userLocation,
      title: userType === 'driver' ? 'Tu ubicación (Conductor)' : 'Tu ubicación (Pasajero)',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: userMarkerColor,
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
      },
    });

    userMarkerRef.current = userMarker;

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, [map, userLocation, isLoaded, userType]);

  // Crear marcadores de paradas y calcular ruta
  useEffect(() => {
    if (!isLoaded || !map || !routeData) return;

    // Limpiar marcadores antiguos
    stopMarkersRef.current.forEach((marker) => marker.setMap(null));
    stopMarkersRef.current = [];

    // Ordenar paradas correctamente por "orden"
    const sortedStops = [...routeData.stops].sort((a, b) => a.orden - b.orden);
    const maxOrden = Math.max(...sortedStops.map(s => s.orden));

    // Crear marcadores para cada parada
    sortedStops.forEach((stop, index) => {
      const stopLat = parseFloat(stop.lat);
      const stopLng = parseFloat(stop.lng);
      const isOrigin = stop.orden === 1;
      const isDestination = stop.orden === maxOrden;

      let markerColor: string;
      let markerTitle: string;

      if (isOrigin) {
        markerColor = '#22C55E'; // Green for origin
        markerTitle = 'Punto de Salida';
      } else if (isDestination) {
        markerColor = '#EF4444'; // Red for destination
        markerTitle = 'Punto de Destino';
      } else {
        markerColor = '#F59E0B'; // Amber for intermediate stops
        markerTitle = `Parada ${stop.orden}`;
      }

      const stopMarker = new google.maps.Marker({
        map,
        position: { lat: stopLat, lng: stopLng },
        title: markerTitle,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });

      stopMarkersRef.current.push(stopMarker);
    });

    // Calcular ruta con DirectionsService
    const directionsService = new google.maps.DirectionsService();
    const firstStop = sortedStops.find(s => s.orden === 1);
    const lastStop = sortedStops.find(s => s.orden === maxOrden);

    if (firstStop && lastStop) {
      const waypoints = sortedStops
        .filter(s => s.orden !== 1 && s.orden !== maxOrden)
        .map((stop) => ({
          location: { lat: parseFloat(stop.lat), lng: parseFloat(stop.lng) },
          stopover: true,
        }));

      directionsService.route(
        {
          origin: { lat: parseFloat(firstStop.lat), lng: parseFloat(firstStop.lng) },
          destination: { lat: parseFloat(lastStop.lat), lng: parseFloat(lastStop.lng) },
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error('Error al calcular la ruta:', status);
            toast.error('Error al calcular la ruta');
          }
        }
      );
    }
  }, [isLoaded, map, routeData]);

  // Centrar en ubicación del usuario
  const centerOnUser = useCallback(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(18);
      setUserHasInteracted(false);
      toast.success('Centrado en tu ubicación');
    }
  }, [map, userLocation]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error al cargar Google Maps. Verifica tu API Key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center" style={{ height: '600px' }}>
        <div className="text-gray-600">Cargando mapa...</div>
      </div>
    );
  }

  if (routeData?.estado?.toUpperCase() === 'FINALIZADA') {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <div className="inline-block w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Ruta Finalizada</h3>
        <p className="text-yellow-800 mb-4">
          Esta ruta ya ha sido completada y no puede ser visualizada en tiempo real.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Volver
        </Button>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded">
        {locationError}
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: '600px' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || { lat: 0, lng: 0 }}
        zoom={18}
        onLoad={(mapInstance) => setMap(mapInstance)}
        onDragStart={() => setUserHasInteracted(true)}
        onZoomChanged={() => setUserHasInteracted(true)}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          mapTypeId: 'roadmap',
        }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Botón para centrar en ubicación */}
      <Button
        onClick={centerOnUser}
        className="absolute bottom-6 right-6 z-10 rounded-full p-3 shadow-lg"
        size="icon"
        title="Centrar en mi ubicación"
      >
        <Navigation className="w-5 h-5" />
      </Button>

      {/* Info de ubicación actual */}
      {userLocation && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md z-10 max-w-xs">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>
              Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
