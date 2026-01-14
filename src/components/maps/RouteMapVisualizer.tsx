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
  const isFirstLocationRef = useRef(true);
  const { toast } = useToast();

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
            disableDefaultUI: true,
          });

          setMap(mapInstance);

          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapInstance,
            polylineOptions: {
              strokeColor: '#0d8a6f',
              strokeWeight: 5,
              strokeOpacity: 0.8,
              geodesic: true,
            },
            suppressMarkers: true,
            suppressPolylines: false,
            preserveViewport: true,
          });
          directionsRendererRef.current = directionsRenderer;

          const sortedStops = [...stops].sort((a, b) => a.orden - b.orden);
          const maxOrden = Math.max(...sortedStops.map(s => s.orden));

          sortedStops.forEach((stop) => {
            const position = {
              lat: parseFloat(stop.lat),
              lng: parseFloat(stop.lng),
            };

            const markerDiv = document.createElement('div');
            markerDiv.className = 'flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg text-sm font-bold';

            if (stop.orden === 1) {
              markerDiv.className += ' bg-green-500 text-white';
              markerDiv.innerHTML = '🚀';
            } else if (stop.orden === maxOrden) {
              markerDiv.className += ' bg-red-500 text-white';
              markerDiv.innerHTML = '🏁';
            } else {
              markerDiv.className += ' bg-yellow-500 text-white';
              markerDiv.innerHTML = String(stop.orden);
            }

            new AdvancedMarkerElement({
              position,
              map: mapInstance,
              title: stop.direccion,
              content: markerDiv,
            });
          });

          setLoading(false);

          startTracking(mapInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initializeMap();
  }, [originCoordinates, stops]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

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

        updateUserMarker(mapInstance, userPos, advancedMarkerElementRef.current);

        mapInstance.setCenter(userPos);

        if (isFirstLocationRef.current) {
          mapInstance.setZoom(18);
          isFirstLocationRef.current = false;
        }

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

  const updateUserMarker = (
    mapInstance: google.maps.Map,
    position: { lat: number; lng: number },
    AdvancedMarkerElement: any
  ) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.position = position;
    } else {
      const markerDiv = document.createElement('div');
      markerDiv.className = 'flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-xl';
      markerDiv.innerHTML = '<div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>';

      const userMarker = new AdvancedMarkerElement({
        position,
        map: mapInstance,
        title: 'Tu ubicación en tiempo real',
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

        {userLocation && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 z-10">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Siguiendo tu ubicación</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
