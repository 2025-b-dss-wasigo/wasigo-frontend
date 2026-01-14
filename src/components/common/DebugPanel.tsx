"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

interface DebugPanelProps {
  routeData: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    waypoints: { lat: number; lng: number }[];
  };
}

export default function DebugPanel({ routeData }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  if (!isOpen) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Info className="w-4 h-4 mr-2" />
        Ver Panel de Prueba
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl border-2 border-blue-500">
      <CardHeader className="pb-3 bg-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" />
            Panel de Prueba 🧪
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="font-semibold text-green-900 mb-2">✅ Datos de la Ruta Mock:</p>
          <div className="space-y-1 text-green-800">
            <p>
              <strong>Origen:</strong> {routeData.origin.lat.toFixed(4)}, {routeData.origin.lng.toFixed(4)}
            </p>
            <p>
              <strong>Destino:</strong> {routeData.destination.lat.toFixed(4)},{" "}
              {routeData.destination.lng.toFixed(4)}
            </p>
            <p>
              <strong>Paradas:</strong> {routeData.waypoints.length}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-semibold text-blue-900 mb-2">📍 Qué observar:</p>
          <ul className="space-y-1 text-blue-800 list-disc list-inside">
            <li>Punto móvil se actualiza cada 3s</li>
            <li>Logs en consola del navegador (F12)</li>
            <li>Ruta optimizada automáticamente</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-3 rounded border border-purple-200">
          <p className="font-semibold text-purple-900 mb-2">🔍 Para probar autocompletado:</p>
          <ul className="space-y-1 text-purple-800 list-disc list-inside">
            <li>Ve a /create-route (conductor)</li>
            <li>Ve a /routes (pasajero)</li>
            <li>Escribe en los campos de dirección</li>
            <li>Selecciona y ve coordenadas en consola</li>
          </ul>
        </div>

        {logs.length > 0 && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-32 overflow-y-auto">
            <p className="font-semibold text-gray-900 mb-2">📝 Últimos Logs:</p>
            <div className="space-y-1 text-gray-700 font-mono">
              {logs.map((log, i) => (
                <p key={i} className="text-xs truncate">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-gray-600 text-center">
            📖 Lee{" "}
            <a href="/TESTING_GUIDE.md" className="text-blue-600 underline">
              TESTING_GUIDE.md
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
