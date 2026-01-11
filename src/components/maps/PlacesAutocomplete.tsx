"use client";

import { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  defaultValue?: string;
}

interface Suggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Buscar dirección...",
  defaultValue = "",
}: PlacesAutocompleteProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

  // Prevenir hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isSelectingRef.current || !inputValue || inputValue.length < 1 || !isLoaded) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Mostrar loader inmediatamente cuando hay texto
    setIsLoading(true);
    setShowSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        // Usar la nueva API de AutocompleteSuggestion
        const request = {
          input: inputValue,
          includedRegionCodes: ["ec"], // Limitar a Ecuador
          // Usar locationBias en lugar de bounds/location/radius
          locationBias: new google.maps.Circle({
            center: { lat: -0.1807, lng: -78.4678 }, // Centro de Quito
            radius: 50000, // 50km
          }),
        };

        const { suggestions: autocompleteSuggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        const formattedSuggestions: Suggestion[] = autocompleteSuggestions.map((suggestion) => ({
          placeId: suggestion.placePrediction?.placeId || "",
          text: suggestion.placePrediction?.text?.toString() || "",
          mainText: suggestion.placePrediction?.mainText?.toString() || "",
          secondaryText: suggestion.placePrediction?.secondaryText?.toString() || "",
        }));

        setSuggestions(formattedSuggestions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [inputValue, isLoaded]);

  const handleSuggestionClick = async (placeId: string, description: string) => {
    try {
      // Marcar que estamos seleccionando para evitar que se regeneren las sugerencias
      isSelectingRef.current = true;

      // Limpiar sugerencias inmediatamente
      setSuggestions([]);
      setShowSuggestions(false);

      // Usar la nueva API de Place
      const place = new google.maps.places.Place({
        id: placeId,
      });

      // Fetch place details
      await place.fetchFields({
        fields: ["location", "formattedAddress"],
      });

      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();

        console.log("Lugar seleccionado:", {
          direccion: description,
          coordenadas: { lat, lng },
        });

        setInputValue(description);
        onPlaceSelect({
          address: description,
          lat,
          lng,
        });
      }

      // Reset el flag después de actualizar el estado
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 0);
    } catch (error) {
      console.error("Error al obtener detalles del lugar:", error);
      isSelectingRef.current = false;
    }
  };

  if (!isHydrated || !isLoaded) {
    return <Input placeholder={placeholder} disabled />;
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {showSuggestions && inputValue.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.placeId}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion.placeId, suggestion.text)}
              >
                <div className="font-medium text-sm">{suggestion.mainText}</div>
                <div className="text-xs text-gray-600">{suggestion.secondaryText}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
