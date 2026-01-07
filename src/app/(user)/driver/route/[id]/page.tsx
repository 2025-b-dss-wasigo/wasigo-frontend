"use client";

import { use } from "react";
import RouteTrackingMap from "@/components/maps/RouteTrackingMap";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DriverRoutePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold">Ruta en Tiempo Real</h1>
        <div className="w-20" />
      </div>

      <div className="relative">
        <RouteTrackingMap routeId={id} userType="driver" />
      </div>
    </div>
  );
}
