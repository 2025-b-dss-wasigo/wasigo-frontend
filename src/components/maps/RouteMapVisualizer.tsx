'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useToast } from '@/hooks/useToast';

interface RouteStop {
  publicId: string;
  lat: string;
  lng: string;
  direccion: string;
  orden: number;
  createdAt: string;
}

interface RouteMapVisualizerProps {
  originCoordinates: { lat: number; lng: number };
  stops: RouteStop[];
}

export function RouteMapVisualizer({
  originCoordinates,
  stops
}: RouteMapVisualizerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const advancedMarkerElementRef = useRef<any>(null);
  const { toast } = useToast();

  // Inicializar Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        });

        const { Map } = await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');
        advancedMarkerElementRef.current = AdvancedMarkerElement;

        if (mapRef.current) {
          // Crear mapa centrado en el origen
          const mapInstance = new Map(mapRef.current, {
            zoom: 14,
            center: originCoordinates,
            mapTypeId: 'roadmap',
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            rotateControl: false,
            scaleControl: false,
          });

          setMap(mapInstance);

          // Crear DirectionsRenderer
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapInstance,
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 3,
              geodesic: true,
            },
            suppressMarkers: true,
            suppressPolylines: false,
          });
          directionsRendererRef.current = directionsRenderer;

          // Crear marcadores de paradas (Advanced Markers)
          const sortedStops = [...stops].sort((a, b) => a.orden - b.orden);

          sortedStops.forEach((stop, index) => {
            const position = {
              lat: parseFloat(stop.lat),
              lng: parseFloat(stop.lng),
            };

            const markerDiv = document.createElement('div');
            markerDiv.className = 'flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg';

            if (index === 0) {
              // Destino final - rojo
              markerDiv.className += ' bg-red-500';
              markerDiv.innerHTML = '🏁';
            } else {
              // Paradas intermedias - amarillo
              markerDiv.className += ' bg-yellow-500';
              markerDiv.innerHTML = String(index);
            }

            new AdvancedMarkerElement({
              position,
              map: mapInstance,
              title: index === 0 ? 'Destino Final' : `Parada ${index}`,
              content: markerDiv,
            });
          });

          setLoading(false);

          // Iniciar seguimiento de ubicación automáticamente
          startTracking(mapInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initializeMap();
  }, [originCoordinates, stops]);

  // Limpiar watch position al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Iniciar seguimiento de ubicación automáticamente
  const startTracking = (mapInstance: google.maps.Map) => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocalización no disponible en este navegador',
        variant: 'destructive'
      });
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);

        // Actualizar marcador de usuario
        updateUserMarker(mapInstance, userPos, advancedMarkerElementRef.current);

        // Centrar mapa en usuario SIEMPRE
        mapInstance.setCenter(userPos);

        // Recalcular ruta desde ubicación actual
        const sortedStops = [...stops].sort((a, b) => a.orden - b.orden);
        if (sortedStops.length > 0 && directionsRendererRef.current) {
          drawRoute(userPos, sortedStops, directionsRendererRef.current);
        }
      },
      (error) => {
        console.warn('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: 'Permiso denegado',
            description: 'Por favor, habilita la geolocalización en tu navegador',
            variant: 'destructive'
          });
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  };

  // Dibujar ruta con Directions Service
  const drawRoute = async (
    origin: { lat: number; lng: number },
    routeStops: RouteStop[],
    directionsRenderer: google.maps.DirectionsRenderer
  ) => {
    const directionsService = new google.maps.DirectionsService();
    const destination = routeStops[routeStops.length - 1];

    const waypoints = routeStops.slice(0, -1).map(stop => ({
      location: {
        lat: parseFloat(stop.lat),
        lng: parseFloat(stop.lng),
      },
      stopover: true,
    }));

    try {
      const result = await directionsService.route({
        origin,
        destination: {
          lat: parseFloat(destination.lat),
          lng: parseFloat(destination.lng),
        },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      directionsRenderer.setDirections(result);
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  // Actualizar marcador de usuario con icono de carrito
  const updateUserMarker = (
    mapInstance: google.maps.Map,
    position: { lat: number; lng: number },
    AdvancedMarkerElement: any
  ) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.position = position;
    } else {
      const markerDiv = document.createElement('div');
      markerDiv.className = 'flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full border-2 border-white shadow-lg';
      markerDiv.innerHTML = '🚗';

      const userMarker = new AdvancedMarkerElement({
        position,
        map: mapInstance,
        title: 'Tu ubicación',
        content: markerDiv,
        zIndex: 1000,
      });

      userMarkerRef.current = userMarker;
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="relative w-full h-full">
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg"
          style={{ minHeight: '600px' }}
        />
      </div>
    </>
  );
}
